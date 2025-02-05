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

  static formatDateTimeForBackend(date, time) {
    // Ensure we have both date and time
    if (!date || !time) {
      throw new Error('Both date and time are required');
    }
    
    // Create a UTC date string that Prisma can parse
    return `${date}T${time}:00.000Z`;
  }

  static formatEventDataForBackend(eventData) {
    try {
      // Extract date and time
      const date = eventData.event_date || eventData.date;
      const time = eventData.event_time || eventData.time;

      // Create the formatted datetime string
      const datetime = this.formatDateTimeForBackend(date, time);

      // Prepare the data object with the correct format
      const formattedData = {
        name: eventData.name,
        description: eventData.description,
        datetime: datetime,
        location: eventData.location,
        event_type: eventData.event_type,
        event_status: eventData.event_status || "Upcoming",
        organizer: eventData.organizer,
        max_participants: parseInt(eventData.max_participants),
        speaker: eventData.speaker,
        agenda: eventData.agenda,
        event_thumbnail: eventData.event_image_url || eventData.event_thumbnail,
      };

      // Remove any undefined values
      Object.keys(formattedData).forEach(key => 
        formattedData[key] === undefined && delete formattedData[key]
      );

      return formattedData;
    } catch (error) {
      console.error('Error formatting event data:', error);
      throw new Error('Failed to format event data: ' + error.message);
    }
  }

  static parseEventDataFromBackend(eventData) {
    if (!eventData) return null;

    try {
      const datetime = new Date(eventData.datetime);
      
      return {
        id: eventData.id,
        name: eventData.name || '',
        description: eventData.description || '',
        date: datetime.toISOString().split('T')[0],
        time: datetime.toTimeString().slice(0, 5),
        datetime: eventData.datetime,
        location: eventData.location || '',
        event_type: eventData.event_type || '',
        event_status: eventData.event_status || 'Upcoming',
        organizer: eventData.organizer || '',
        max_participants: eventData.max_participants || 0,
        agenda: eventData.agenda || [],
        speaker: eventData.speaker || [],
        event_thumbnail: eventData.event_thumbnail || null,
        participants: eventData.participants || [],
        totalParticipants: eventData.participants?.length || 0
      };
    } catch (error) {
      console.error('Error parsing event data:', error);
      throw error;
    }
  }

  static async createEvent(eventData) {
    try {
      let eventImageUrl = eventData.event_image_url;

      if (eventData.event_image instanceof File) {
        eventImageUrl = await this.uploadImage(eventData.event_image);
      }

      const formattedData = this.formatEventDataForBackend({
        ...eventData,
        event_image_url: eventImageUrl
      });

      const response = await api.post("/events", formattedData);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  static async updateEvent(eventId, eventData) {
    try {
      let eventImageUrl = eventData.event_image_url;

      if (eventData.event_image instanceof File) {
        eventImageUrl = await this.uploadImage(eventData.event_image);
      }

      const formattedData = this.formatEventDataForBackend({
        ...eventData,
        event_image_url: eventImageUrl
      });

      const response = await api.patch(`/events/${eventId}`, formattedData);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

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

  static async getEvent(eventId) {
    try {
      const response = await api.get(`/events/${eventId}`);
      return this.parseEventDataFromBackend(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  static async deleteEvent(eventId) {
    try {
      await api.delete(`/events/${eventId}`);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

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
}

export default EventsAPI;