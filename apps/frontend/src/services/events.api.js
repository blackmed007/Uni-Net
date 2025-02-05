import axios from "axios";

const API_URL = "http://localhost:5004/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class EventsAPI {
  static EVENT_TYPES = ["Workshop", "Social", "Conference", "Seminar"];
  static EVENT_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

  // Image Upload Handler
  static async uploadImage(file) {
    try {
      if (!file) throw new Error("No file provided");
      const formData = new FormData();
      formData.append("event_image", file);
      const response = await api.post("/events/upload-event-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.url;
    } catch (error) {
      console.error("Error uploading event image:", error);
      throw error;
    }
  }

  // Backend Data Formatting
  static formatEventDataForBackend(eventData, isUpdate = false) {
    try {
      // For update operations, use the data as is with datetime
      if (isUpdate) {
        const formattedData = {
          name: eventData.name,
          description: eventData.description,
          datetime: new Date(`${eventData.date}T${eventData.time}`).toISOString(),
          location: eventData.location,
          event_type: eventData.event_type,
          event_status: eventData.event_status || "Upcoming",
          organizer: eventData.organizer,
          max_participants: parseInt(eventData.max_participants),
          speaker: eventData.speaker || [],
          agenda: eventData.agenda || [],
          event_thumbnail: eventData.event_image_url || eventData.event_thumbnail
        };

        // Remove any undefined fields
        Object.keys(formattedData).forEach(key => 
          formattedData[key] === undefined && delete formattedData[key]
        );

        return formattedData;
      }

      // For create operations, use event_date and event_time
      const formattedData = {
        name: eventData.name,
        description: eventData.description,
        event_date: eventData.date,
        event_time: eventData.time,
        location: eventData.location,
        event_type: eventData.event_type,
        event_status: eventData.event_status || "Upcoming",
        organizer: eventData.organizer,
        max_participants: parseInt(eventData.max_participants),
        speaker: eventData.speaker || [],
        agenda: eventData.agenda || [],
        event_image_url: eventData.event_image_url || eventData.event_thumbnail
      };

      // Remove any undefined fields
      Object.keys(formattedData).forEach(key => 
        formattedData[key] === undefined && delete formattedData[key]
      );

      return formattedData;
    } catch (error) {
      console.error('Error formatting event data:', error);
      throw new Error('Failed to format event data: ' + error.message);
    }
  }

  // Parse Backend Data
  static parseEventDataFromBackend(eventData) {
    if (!eventData) return null;

    try {
      const datetime = new Date(eventData.datetime);
      
      return {
        id: eventData.id,
        name: eventData.name || '',
        description: eventData.description || '',
        date: eventData.event_date || datetime.toISOString().split('T')[0],
        time: eventData.event_time || datetime.toTimeString().slice(0, 5),
        location: eventData.location || '',
        event_type: eventData.event_type || '',
        event_status: eventData.event_status || 'Upcoming',
        organizer: eventData.organizer || '',
        max_participants: eventData.max_participants || 0,
        agenda: eventData.agenda || [],
        speaker: eventData.speaker || [],
        event_thumbnail: eventData.event_thumbnail || null,
        participants: eventData.participants || [],
        totalParticipants: eventData.participants?.length || 0,
        views: eventData.views || 0
      };
    } catch (error) {
      console.error('Error parsing event data:', error);
      throw error;
    }
  }

  // Create Event
  static async createEvent(eventData) {
    try {
      let eventImageUrl = eventData.event_image_url;

      if (eventData.event_image instanceof File) {
        eventImageUrl = await this.uploadImage(eventData.event_image);
      }

      const formattedData = this.formatEventDataForBackend({
        ...eventData,
        event_image_url: eventImageUrl
      }, false);

      const response = await api.post("/events", formattedData);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Update Event
  static async updateEvent(eventId, eventData) {
    try {
      let eventImageUrl = eventData.event_image_url;

      if (eventData.event_image instanceof File) {
        eventImageUrl = await this.uploadImage(eventData.event_image);
      }

      const formattedData = this.formatEventDataForBackend({
        ...eventData,
        event_image_url: eventImageUrl
      }, true);

      const response = await api.patch(`/events/${eventId}`, formattedData);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Get All Events
  static async getEvents(filters = {}) {
    try {
      let url = "/events";
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.date) params.append('date', filters.date);
      if (filters.search) params.append('search', filters.search);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      return Array.isArray(response.data)
        ? response.data.map(event => this.parseEventDataFromBackend(event))
        : [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  // Get Single Event
  static async getEvent(eventId) {
    try {
      const response = await api.get(`/events/${eventId}`);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  // Delete Event
  static async deleteEvent(eventId) {
    try {
      await api.delete(`/events/${eventId}`);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Update Event Status
  static async updateEventStatus(eventId, status) {
    try {
      if (!this.EVENT_STATUSES.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${this.EVENT_STATUSES.join(', ')}`);
      }

      const response = await api.patch(`/events/${eventId}`, {
        event_status: status
      });

      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error updating event status:", error);
      throw error;
    }
  }

  // Get Event Participants
  static async getEventParticipants(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/participants`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event participants:", error);
      throw error;
    }
  }

  // Join Event
  static async joinEvent(eventId) {
    try {
      const response = await api.post(`/users/join-event`, {
        eventId
      });
      return response.data;
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  }

  // Leave Event
  static async leaveEvent(eventId) {
    try {
      const response = await api.delete(`/users/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  }

  // Format DateTime for Display
  static formatDateTimeForDisplay(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  // Check if event is joinable
  static isEventJoinable(event) {
    if (!event) return false;
    
    const now = new Date();
    const eventDate = new Date(event.datetime);
    const isUpcoming = event.event_status === 'Upcoming';
    const hasSpace = event.totalParticipants < event.max_participants;
    const notPassed = eventDate > now;

    return isUpcoming && hasSpace && notPassed;
  }

  // Validate event data
  static validateEventData(eventData) {
    const requiredFields = [
      'name',
      'description',
      'date',
      'time',
      'location',
      'event_type',
      'organizer',
      'max_participants'
    ];

    const missingFields = requiredFields.filter(field => !eventData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (!this.EVENT_TYPES.includes(eventData.event_type)) {
      throw new Error(`Invalid event type. Must be one of: ${this.EVENT_TYPES.join(', ')}`);
    }

    if (eventData.event_status && !this.EVENT_STATUSES.includes(eventData.event_status)) {
      throw new Error(`Invalid event status. Must be one of: ${this.EVENT_STATUSES.join(', ')}`);
    }

    const maxParticipants = parseInt(eventData.max_participants);
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      throw new Error('Maximum participants must be a positive number');
    }

    const eventDate = new Date(`${eventData.date}T${eventData.time}`);
    if (eventDate < new Date()) {
      throw new Error('Event date cannot be in the past');
    }

    return true;
  }
}

export default EventsAPI;