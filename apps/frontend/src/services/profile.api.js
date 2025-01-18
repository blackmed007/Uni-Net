import axios from 'axios';

const API_URL = 'http://localhost:5003/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

class ProfileAPI {
  // Get current user's profile
  static async getCurrentProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const response = await api.patch(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload profile image
  static async uploadProfileImage(userId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('profile_url', imageFile);

      const response = await api.post('/users/onboard', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update full profile with image
  static async updateFullProfile(userId, profileData, imageFile = null) {
    try {
      let updatedProfile = profileData;

      // If there's a new image, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('profile_url', imageFile);
        
        // Keep existing profile data in the form
        Object.keys(profileData).forEach(key => {
          formData.append(key, profileData[key]);
        });

        const imageUploadResponse = await api.post('/users/onboard', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        updatedProfile = {
          ...profileData,
          profile_url: imageUploadResponse.data.profile_url
        };
      }

      // Update the rest of the profile data
      const response = await this.updateProfile(userId, updatedProfile);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileAPI;