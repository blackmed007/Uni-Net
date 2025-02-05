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
  // Existing methods...

  // Add bookmark for a blog
  static async addBookmark(blogId) {
    try {
      const response = await api.post('/users/bookmarks', { blogId });
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  // Get user's bookmarks
  static async getBookmarks() {
    try {
      const response = await api.get('/users/bookmarks');
      return response.data.map(bookmark => ({
        id: bookmark.id,
        blogId: bookmark.blogId,
        blog: bookmark.blog
      }));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  }

  // Remove bookmark for a blog
  static async removeBookmark(blogId) {
    try {
      const response = await api.delete(`/users/bookmarks/${blogId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  // Existing methods remain the same...
  
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
        sessionStorage.setItem('access_token', authResponse.data.access_token);

        // Prepare onboarding data
        const formData = new FormData();
        
        // Handle profile image if it exists
        if (userData.profile_url instanceof File) {
          formData.append('profile_url', userData.profile_url);
        }

        // Add onboarding data
        const onboardData = {
          gender: userData.gender?.toLowerCase() || 'male',
          cityId: userData.cityId,
          universityId: userData.universityId,
          status: true
        };

        // Append data to FormData with proper type handling
        Object.entries(onboardData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (typeof value === 'boolean') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });

        // Submit onboarding data
        const onboardResponse = await api.post('/users/onboard', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

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
      const userDataFormatted = this.formatUserData(userData, false);  // Pass false to indicate this is an update

      if (userData.profile_url instanceof File) {
        const formData = new FormData();
        formData.append('profile_url', userData.profile_url);
        
        Object.entries(userDataFormatted).forEach(([key, value]) => {
          if (value !== null && value !== undefined && key !== 'profile_url') {
            if (typeof value === 'boolean') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });

        const response = await api.patch(`/users/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return this.parseUserData(response.data);
      }

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

  // Get user activity
  static async getUserActivity(userId) {
    try {
      const response = await api.get(`/users/activity`);
      if (!response.data) return [];
      
      return Array.isArray(response.data) 
        ? response.data.map(activity => ({
            id: activity.id,
            activity: activity.activity,
            createdAt: activity.createdAt
          }))
        : [];
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  // Get user events
  static async getUserEvents(userId) {
    try {
      const response = await api.get(`/users/events`);
      if (!response.data) return [];
      
      return Array.isArray(response.data) 
        ? response.data.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            datetime: event.datetime,
            location: event.location,
            event_type: event.event_type,
            event_status: event.event_status,
            organizer: event.organizer,
            max_participants: event.max_participants,
            agenda: event.agenda,
            speaker: event.speaker,
            event_thumbnail: event.event_thumbnail
          }))
        : [];
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }

  // Format user data for API
  static formatUserData(userData, isCreate = true) {
    const formatted = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      role: isCreate ? userData.role?.toLowerCase() : userData.role,
      gender: userData.gender?.toLowerCase(),
      cityId: userData.cityId || userData.cityld,
      universityId: userData.universityId || userData.universityld,
      status: typeof userData.status === 'boolean' ? userData.status : userData.status === 'Active'
    };

    // Clean undefined and null values
    Object.keys(formatted).forEach(key => {
      if (formatted[key] === undefined || formatted[key] === null) {
        delete formatted[key];
      }
    });

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
}

export default UsersAPI;