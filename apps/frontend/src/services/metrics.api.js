import axios from "axios";

const API_URL = "http://localhost:5004/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem("access_token");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden:", error.response.data);
          break;
        case 404:
          console.error("Resource not found:", error.response.data);
          break;
        case 422:
          console.error("Validation error:", error.response.data);
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error:", error.request);
    }
    return Promise.reject(error);
  },
);

class MetricsAPI {
  // Fetch all metrics summary
  static async getMetricsSummary() {
    try {
      const response = await api.get("/metrics/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics summary:", error);
      throw error;
    }
  }

  // Get distributions metrics
  static async getMetricsDistributions() {
    try {
      const response = await api.get(`/metrics/user-distribution`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user-distributions:", error);
      throw error;
    }
  }

  // Get recent activity
  static async getMetricsRecentActivities() {
    try {
      const response = await api.get("/metrics/recent-activity");
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics recent-activities:", error);
      throw error;
    }
  }

  // Get Activity Overview
  static async getMetricsActivityOverview() {
    try {
      const response = await api.get("/metrics/activity-overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics recent-activities:", error);
      throw error;
    }
  }

  // Get Activity Overview
  static async getMetricsEngagementOverview() {
    try {
      const response = await api.get("/metrics/engagement-overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics engagement overview:", error);
      throw error;
    }
  }
}

export default MetricsAPI;
