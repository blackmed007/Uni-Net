import axios from 'axios';

const API_URL = 'http://localhost:5004/api/v1';

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

class LocationAPI {
  // Universities
  static async fetchUniversities() {
    try {
      const response = await api.get('/universities');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async addUniversity(universityData) {
    try {
      const response = await api.post('/universities', universityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateUniversity(universityId, universityData) {
    try {
      const response = await api.patch(`/universities/${universityId}`, universityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUniversity(universityId) {
    try {
      const response = await api.delete(`/universities/${universityId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cities
  static async fetchCities() {
    try {
      const response = await api.get('/cities');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async addCity(cityData) {
    try {
      const response = await api.post('/cities', cityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateCity(cityId, cityData) {
    try {
      const response = await api.patch(`/cities/${cityId}`, cityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCity(cityId) {
    try {
      const response = await api.delete(`/cities/${cityId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default LocationAPI;