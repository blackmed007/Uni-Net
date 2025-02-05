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
  }
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
  }
);

class EventsAPI {
  // Constants for valid values
  static EVENT_TYPES = ["Workshop", "Social", "Conference", "Seminar"];
  static EVENT_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

  // Upload event image and get URL
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("event_image", file);

      const response = await api.post("/events/upload-event-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data || !response.data.url) {
        throw new Error("Invalid image upload response");
      }

      return response.data.url;
    } catch (error) {
      console.error("Error uploading event image:", error);
      throw error;
    }
  }

  // Format event data for backend
  static formatEventDataForBackend(eventData) {
    try {
      // Ensure event status is valid
      const eventStatus = eventData.event_status || 'Upcoming';
      if (!this.EVENT_STATUSES.includes(eventStatus)) {
        throw new Error(`Invalid event status: ${eventStatus}. Must be one of: ${this.EVENT_STATUSES.join(', ')}`);
      }

      // Ensure event type is valid
      const eventType = eventData.event_type;
      if (!this.EVENT_TYPES.includes(eventType)) {
        throw new Error(`Invalid event type: ${eventType}. Must be one of: ${this.EVENT_TYPES.join(', ')}`);
      }

      // Format date and time if both are provided
      let formattedDate = eventData.event_date || eventData.date;
      let formattedTime = eventData.event_time || eventData.time;

      return {
        name: eventData.name,
        description: eventData.description,
        event_date: formattedDate,
        event_time: formattedTime,
        location: eventData.location,
        event_type: eventType,
        event_status: eventStatus,
        organizer: eventData.organizer,
        max_participants: parseInt(eventData.max_participants),
        speaker: Array.isArray(eventData.speaker) ? eventData.speaker : [],
        agenda: Array.isArray(eventData.agenda) ? eventData.agenda : [],
        event_image_url: eventData.event_image_url || eventData.event_thumbnail || ''
      };
    } catch (error) {
      console.error('Error formatting event data for backend:', error);
      throw error;
    }
  }

  // Parse event data from backend
  static parseEventDataFromBackend(eventData) {
    if (!eventData) return null;

    try {
      // Parse the datetime string from backend
      const datetime = new Date(eventData.datetime);
      const date = datetime.toISOString().split('T')[0];
      const time = datetime.toTimeString().slice(0, 5);

      return {
        id: eventData.id,
        name: eventData.name || '',
        description: eventData.description || '',
        date: date,
        time: time,
        datetime: eventData.datetime, // Keep the original datetime for display
        location: eventData.location || '',
        event_type: eventData.event_type || '',
        event_status: eventData.event_status || 'Upcoming',
        organizer: eventData.organizer || '',
        max_participants: eventData.max_participants || 0,
        agenda: Array.isArray(eventData.agenda) ? eventData.agenda : [],
        speaker: Array.isArray(eventData.speaker) ? eventData.speaker : [],
        event_thumbnail: eventData.event_thumbnail || null,
        participants: eventData.participants || [],
        totalParticipants: eventData.participants?.length || 0,
        views: eventData.views || 0
      };
    } catch (error) {
      console.error('Error parsing event data from backend:', error);
      throw new Error('Invalid event data from backend');
    }
  }

  // Fetch all events
  static async getEvents() {
    try {
      const response = await api.get("/events");
      return Array.isArray(response.data)
        ? response.data.map(event => this.parseEventDataFromBackend(event))
        : [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  // Get single event
  static async getEvent(eventId) {
    try {
      const response = await api.get(`/events/${eventId}`);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  // Create new event
  static async createEvent(eventData) {
    try {
      let eventImageUrl = null;

      // Upload image if it exists
      if (eventData.event_image instanceof File) {
        eventImageUrl = await this.uploadImage(eventData.event_image);
      }

      // Prepare event data for backend
      const postData = this.formatEventDataForBackend({
        ...eventData,
        event_image_url: eventImageUrl || eventData.event_image_url
      });

      const response = await api.post("/events", postData);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Update event
  static async updateEvent(eventId, eventData) {
    try {
      let eventImageUrl = null;

      // Upload new image if it exists
      if (eventData.event_image instanceof File) {
        eventImageUrl = await this.uploadImage(eventData.event_image);
      }

      // Prepare update data
      const updateData = this.formatEventDataForBackend({
        ...eventData,
        event_image_url: eventImageUrl || eventData.event_image_url
      });

      const response = await api.patch(`/events/${eventId}`, updateData);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Delete event
  static async deleteEvent(eventId) {
    try {
      await api.delete(`/events/${eventId}`);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Validate event data before sending to backend
  static validateEventData(eventData) {
    try {
      const requiredFields = [
        "name",
        "description",
        "date",
        "time",
        "location",
        "event_type",
        "event_status",
        "organizer",
        "max_participants",
      ];

      // Check for missing required fields
      const missingFields = requiredFields.filter(
        field => !eventData[field] ||
          (typeof eventData[field] === "string" && !eventData[field].trim())
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Validate event type
      if (!this.EVENT_TYPES.includes(eventData.event_type)) {
        throw new Error(`Invalid event type. Must be one of: ${this.EVENT_TYPES.join(", ")}`);
      }

      // Validate event status
      if (!this.EVENT_STATUSES.includes(eventData.event_status)) {
        throw new Error(`Invalid event status. Must be one of: ${this.EVENT_STATUSES.join(", ")}`);
      }

      // Validate max participants
      const maxParticipants = parseInt(eventData.max_participants);
      if (isNaN(maxParticipants) || maxParticipants < 1) {
        throw new Error("Max participants must be a positive number");
      }

      // Validate speakers if present
      if (eventData.speaker && Array.isArray(eventData.speaker)) {
        const invalidSpeakers = eventData.speaker.some(
          speaker => !speaker.name || !speaker.role
        );
        if (invalidSpeakers) {
          throw new Error("All speakers must have a name and role");
        }
      }

      return true;
    } catch (error) {
      console.error("Event validation error:", error);
      throw error;
    }
  }

  // Format date for display (kept for backward compatibility)
  static formatDateForDisplay(date) {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  }

  // Format date and time for display (matches BlogPostList format)
  static formatDateTimeForDisplay(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return dateString;
    }
  }

  // Format time for display
  static formatTimeForDisplay(time) {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  }
}

export default EventsAPI;