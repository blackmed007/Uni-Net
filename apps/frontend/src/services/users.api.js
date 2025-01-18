import axios from 'axios';

const API_URL = 'http://localhost:5003/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          sessionStorage.removeItem('access_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden:', error.response.data);
          break;
        case 404:
          console.error('Resource not found:', error.response.data);
          break;
        case 422:
          console.error('Validation error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    }
    return Promise.reject(error);
  }
);

class UsersAPI {
  // Fetch users with filtering, sorting, and pagination
  static async getUsers(params = {}) {
    try {
      const {
        page = 1,
        perPage = 10,
        search = '',
        sortBy = '',
        sortDirection = 'asc',
        ...filters
      } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('perPage', perPage.toString());

      if (search) {
        queryParams.append('search', search);
      }

      if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDirection', sortDirection);
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/users?${queryParams}`);
      return Array.isArray(response.data) 
        ? response.data.map(user => this.parseUserData(user))
        : response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get single user
  static async getUser(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return this.parseUserData(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Create new user using signup and onboard endpoints
  static async createUser(userData) {
    try {
      // Step 1: Create the base user account using signup
      const signupData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role?.toLowerCase()
      };

      const signupResponse = await api.post('/auth/signup', signupData);
      
      if (!signupResponse.data.access_token) {
        throw new Error('No access token received after signup');
      }

      // Store the token temporarily for the onboarding request
      const originalToken = sessionStorage.getItem('access_token');
      sessionStorage.setItem('access_token', signupResponse.data.access_token);

      try {
        // Step 2: Prepare onboarding data
        const formData = new FormData();
        
        if (userData.profile_url instanceof File) {
          formData.append('profile_url', userData.profile_url);
        }

        formData.append('gender', userData.gender?.toLowerCase());
        formData.append('cityId', userData.cityId);
        formData.append('universityId', userData.universityId);

        // Step 3: Complete the onboarding
        const onboardResponse = await api.post('/users/onboard', formData);

        // Restore the original admin token
        if (originalToken) {
          sessionStorage.setItem('access_token', originalToken);
        }

        return this.parseUserData(onboardResponse.data);
      } catch (error) {
        // If onboarding fails, restore the original token before throwing the error
        if (originalToken) {
          sessionStorage.setItem('access_token', originalToken);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId, userData) {
    try {
      const formData = new FormData();
      
      if (userData.profile_url instanceof File) {
        formData.append('profile_url', userData.profile_url);
      }

      Object.entries(this.formatUserData(userData)).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'profile_url') {
          formData.append(key, value.toString());
        }
      });

      const response = await api.patch(`/users/${userId}`, formData);
      return this.parseUserData(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Suspend user
  static async suspendUser(userId) {
    try {
      const response = await api.patch(`/users/${userId}`, {
        status: false
      });
      return this.parseUserData(response.data);
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  }

  // Activate user
  static async activateUser(userId) {
    try {
      const response = await api.patch(`/users/${userId}`, {
        status: true
      });
      return this.parseUserData(response.data);
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  // Get user events
  static async getUserEvents(userId) {
    try {
      const response = await api.get(`/users/${userId}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }

  // Get user activity
  static async getUserActivity(userId) {
    try {
      const response = await api.get(`/users/${userId}/activity`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  // Format user data for API
  static formatUserData(userData) {
    return {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role?.toLowerCase(),
      gender: userData.gender?.toLowerCase(),
      profile_url: userData.profile_url,
      cityId: userData.cityId,
      universityId: userData.universityId,
      status: userData.status === 'Active' || userData.status === true ? true : false
    };
  }

  // Parse user data from API
  static parseUserData(userData) {
    if (!userData) return null;
    
    return {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      role: userData.role,
      gender: userData.gender,
      profile_url: userData.profile_url,
      cityId: userData.cityId,
      universityId: userData.universityId,
      city: userData.city,
      university: userData.university,
      status: userData.status === true ? 'Active' : 'Suspended',
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };
  }
}

export default UsersAPI;