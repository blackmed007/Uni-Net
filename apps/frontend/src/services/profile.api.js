import axios from "axios";

const API_URL = "http://localhost:5004/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
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
      const response = await api.get("/users/me");
      return this.transformUserData(response.data);
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const transformedData = this.formatUserData(profileData);
      const response = await api.patch(`/users/${userId}`, transformedData);
      return this.transformUserData(response.data);
    } catch (error) {
      throw error;
    }
  }

  // Upload profile image
  static async uploadProfileImage(userId, imageFile) {
    try {
      const formData = new FormData();
      formData.append("profile_url", imageFile);

      const response = await api.post("/users/onboard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return this.transformUserData(response.data);
    } catch (error) {
      throw error;
    }
  }

  // Update full profile with image
  static async updateFullProfile(userId, profileData, imageFile = null) {
    try {
      const formData = new FormData();

      // Convert profileData to backend format
      const transformedData = this.formatUserData(profileData);

      // Append transformed data to formData
      Object.keys(transformedData).forEach((key) => {
        const value = transformedData[key];
        if (value !== null && value !== undefined) {
          formData.append(key, 
            typeof value === 'boolean' ? JSON.stringify(value) : value
          );
        }
      });

      // If there's a new image, append it
      if (imageFile instanceof File) {
        formData.append("profile_url", imageFile);
      }

      // Send the update request
      const response = await api.patch(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return this.transformUserData(response.data);
    } catch (error) {
      throw error;
    }
  }

  // Format user data for API submission
  static formatUserData(userData) {
    const formattedData = {
      first_name: userData.firstName || userData.first_name,
      last_name: userData.lastName || userData.last_name,
      email: userData.email,
      profile_url: userData.profile_url instanceof File 
        ? undefined 
        : userData.profile_url,
    };

    // Handle university
    if (userData.universityId) {
      formattedData.universityId = userData.universityId;
    } else if (userData.university) {
      formattedData.universityId = userData.university;
    }

    // Handle city
    if (userData.cityId) {
      formattedData.cityId = userData.cityId;
    } else if (userData.city) {
      formattedData.cityId = userData.city;
    }

    // Remove undefined values
    Object.keys(formattedData).forEach(
      key => formattedData[key] === undefined && delete formattedData[key]
    );

    return formattedData;
  }

  // Transform user data from backend to frontend format
  static transformUserData(userData) {
    if (!userData) return null;

    return {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      profileImage: userData.profile_url,
      role: userData.role,
      status: userData.status === true ? 'Active' : 'Suspended',
      createdAt: userData.createdAt,
      
      // Add university and city details
      universityId: userData.universityId,
      cityId: userData.cityId,
      university: userData.university?.name || userData.university,
      city: userData.city?.name || userData.city
    };
  }
}

export default ProfileAPI;