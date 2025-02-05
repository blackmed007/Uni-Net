import axios from 'axios';

const API_URL = 'http://localhost:5004/api/v1';

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
  // Fetch all users
  static async getUsers() {
    try {
      const response = await api.get('/users');
      return Array.isArray(response.data) 
        ? response.data.map(user => this.parseUserData(user))
        : [];
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

  // Create new user
  static async createUser(userData) {
    try {
      // First create the user account via auth signup
      const signupData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role?.toLowerCase() || 'user'
      };

      const authResponse = await api.post('/auth/signup', signupData);

      if (!authResponse.data.access_token) {
        throw new Error('Failed to create user account');
      }

      // Store the original admin token
      const originalToken = sessionStorage.getItem('access_token');

      try {
        // Set the new user's token for onboarding
        const newUserToken = authResponse.data.access_token;
        sessionStorage.setItem('access_token', newUserToken);

        // Prepare onboarding data
        const formData = new FormData();
        
        // Handle profile image if it exists
        if (userData.profile_url instanceof File) {
          formData.append('profile_url', userData.profile_url);
        }

        // Add onboarding data
        formData.append('gender', userData.gender?.toLowerCase() || 'male');
        formData.append('cityId', userData.cityId);
        formData.append('universityId', userData.universityId);
        formData.append('status', Boolean(userData.status));

        // Submit onboarding data
        const onboardResponse = await api.post('/users/onboard', formData);

        return this.parseUserData(onboardResponse.data);
      } finally {
        // Restore the original admin token
        sessionStorage.setItem('access_token', originalToken);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId, userData) {
    try {
      // Format the user data first
      const userDataFormatted = this.formatUserData(userData);

      // If there's a file upload, use FormData
      if (userData.profile_url instanceof File) {
        const formData = new FormData();
        formData.append('profile_url', userData.profile_url);
        
        // Append other fields
        Object.entries(userDataFormatted).forEach(([key, value]) => {
          if (value !== null && value !== undefined && key !== 'profile_url') {
            formData.append(key, value);
          }
        });
        
        const response = await api.patch(`/users/${userId}`, formData);
        return this.parseUserData(response.data);
      }

      // If no file upload, send JSON directly
      const response = await api.patch(`/users/${userId}`, userDataFormatted);
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

  // Format user data for API
  static formatUserData(userData) {
    const formatted = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      role: userData.role?.toLowerCase(),
      gender: userData.gender?.toLowerCase(),
      cityId: userData.cityId,
      universityId: userData.universityId,
      status: typeof userData.status === 'boolean' ? userData.status : userData.status === 'Active'
    };

    // Only include password if it exists
    if (userData.password) {
      formatted.password = userData.password;
    }

    return formatted;
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
}

export default UsersAPI;