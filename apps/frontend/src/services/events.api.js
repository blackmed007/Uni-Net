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

class EventsAPI {
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

      return response.data.url;
    } catch (error) {
      console.error("Error uploading event image:", error);
      throw error;
    }
  }

  // Parse event data from API response
  static parseEventData(eventData) {
    if (!eventData) return null;

    return {
      id: eventData.id,
      name: eventData.name || "",
      description: eventData.description || "",
      datetime: eventData.datetime || "",
      date: new Date(eventData.datetime).toISOString().split("T")[0],
      time: new Date(eventData.datetime).toTimeString().slice(0, 5),
      location: eventData.location || "",
      event_type: eventData.event_type || "",
      event_status: eventData.event_status || "Upcoming",
      organizer: eventData.organizer || "",
      max_participants: eventData.max_participants || 0,
      agenda: Array.isArray(eventData.agenda) ? eventData.agenda : [],
      speaker: Array.isArray(eventData.speaker) ? eventData.speaker : [],
      event_image_url: eventData.event_thumbnail || null,
      totalParticipants: eventData.participants?.length || 0,
    };
  }

  // Fetch all events
  static async getEvents() {
    try {
      const response = await api.get("/events");
      return Array.isArray(response.data)
        ? response.data.map((event) => this.parseEventData(event))
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
      return this.parseEventData(response.data);
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

      // Prepare event data
      const postData = {
        name: eventData.name,
        description: eventData.description,
        event_date: eventData.date,
        event_time: eventData.time,
        location: eventData.location,
        event_type: eventData.event_type,
        event_status: eventData.event_status,
        organizer: eventData.organizer,
        max_participants: parseInt(eventData.max_participants),
        agenda: eventData.agenda,
        speaker: eventData.speaker,
        event_image_url: eventImageUrl || eventData.event_image_url || "",
      };

      const response = await api.post("/events", postData);
      return this.parseEventData(response.data);
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
      const updateData = {
        name: eventData.name,
        description: eventData.description,
        event_date: eventData.date,
        event_time: eventData.time,
        location: eventData.location,
        event_type: eventData.event_type,
        event_status: eventData.event_status,
        organizer: eventData.organizer,
        max_participants: parseInt(eventData.max_participants),
        agenda: eventData.agenda,
        speaker: eventData.speaker,
      };

      // Only include image URL if a new image was uploaded
      if (eventImageUrl) {
        updateData.event_image_url = eventImageUrl;
      }

      const response = await api.patch(`/events/${eventId}`, updateData);
      return this.parseEventData(response.data);
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

  // Validate event data
  static validateEventData(eventData) {
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

    const missingFields = requiredFields.filter(
      (field) =>
        !eventData[field] ||
        (typeof eventData[field] === "string" && !eventData[field].trim()),
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate event type
    const validTypes = ["Workshop", "Social", "Conference", "Seminar"];
    if (!validTypes.includes(eventData.event_type)) {
      throw new Error("Invalid event type");
    }

    // Validate status
    const validStatuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
    if (!validStatuses.includes(eventData.event_status)) {
      throw new Error("Invalid event status");
    }

    // Validate max participants
    if (
      isNaN(parseInt(eventData.max_participants)) ||
      parseInt(eventData.max_participants) < 0
    ) {
      throw new Error("Max participants must be a positive number");
    }

    return true;
  }
}

export default EventsAPI;

