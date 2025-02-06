import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5004/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message,
    });
    return Promise.reject(error);
  },
);

// Helper function to ensure array response
const ensureArray = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

// Helper function to check and update event status
const checkAndUpdateEventStatus = async (event) => {
  try {
    const currentParticipants = event.participants?.length || 0;
    if (currentParticipants >= event.max_participants && event.event_status !== 'Completed') {
      await api.patch(`/events/${event.id}`, {
        event_status: 'Completed'
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

// Helper function to format event data for frontend consistency
const formatEventData = (event) => {
  if (!event) return null;

  try {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.datetime,
      time: new Date(event.datetime).toLocaleTimeString(),
      location: event.location,
      type: event.event_type,
      status: event.event_status,
      organizer: event.organizer,
      image: event.event_thumbnail,
      maxParticipants: event.max_participants,
      participants: event.participants || [],
      agenda: event.agenda || [],
      speaker: event.speaker || [],
      joinedAt: event.joinedAt,
    };
  } catch (error) {
    console.error("Error formatting event data:", error);
    return null;
  }
};

const userEventsApi = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await api.get("/events");
      console.log("Raw API response:", response.data); // Debug log

      const eventsArray = ensureArray(response.data);
      const formattedEvents = eventsArray
        .map(formatEventData)
        .filter((event) => event !== null); // Remove any null events

      console.log("Formatted events:", formattedEvents); // Debug log
      return formattedEvents;
    } catch (error) {
      console.error("Error in getAllEvents:", error);
      throw new Error("Failed to fetch events");
    }
  },

  // Get single event by ID
  getEventById: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return formatEventData(response.data);
    } catch (error) {
      console.error("Error in getEventById:", error);
      throw new Error("Failed to fetch event details");
    }
  },

  // Get user's joined events
  getUserEvents: async () => {
    try {
      const response = await api.get("/users/me");
      const userEvents = response.data.events || [];
      return userEvents.map(formatEventData).filter(Boolean);
    } catch (error) {
      console.error("Error in getUserEvents:", error);
      return []; // Return empty array instead of throwing
    }
  },

  // Join an event
  joinEvent: async (eventId) => {
    try {
      // First get the event details
      const eventResponse = await api.get(`/events/${eventId}`);
      const event = eventResponse.data;

      // Join the event
      const response = await api.post("/users/join-event", {
        eventId,
      });

      // Check and update status if needed
      await checkAndUpdateEventStatus({
        ...event,
        participants: [...(event.participants || []), { id: response.data.userId }]
      });

      return response.data;
    } catch (error) {
      console.error("Error in joinEvent:", error);
      throw new Error("Failed to join event");
    }
  },

  // Leave an event
  leaveEvent: async (eventId) => {
    try {
      const response = await api.post(`/users/leave-event`, {
        eventId,
      });
      return response.data;
    } catch (error) {
      console.error("Error in leaveEvent:", error);
      throw new Error("Failed to leave event");
    }
  },

  // Get user's bookmarked events
  getUserBookmarks: async () => {
    try {
      const response = await api.get("/users/event-bookmarks");
      const bookmarksArray = ensureArray(response.data);
      console.log(bookmarksArray);
      return bookmarksArray
        .map((bookmark) => ({
          ...formatEventData(bookmark.event),
          bookmarkedAt: bookmark.createdAt,
        }))
        .filter(Boolean);
    } catch (error) {
      console.error("Error in getUserBookmarks:", error);
      return []; // Return empty array instead of throwing
    }
  },

  // Add bookmark
  addBookmark: async (eventId) => {
    try {
      const response = await api.post("/users/event-bookmarks", {
        eventId,
      });
      return response.data;
    } catch (error) {
      console.error("Error in addBookmark:", error);
      throw new Error("Failed to bookmark event");
    }
  },

  // Remove bookmark
  removeBookmark: async (eventId) => {
    try {
      const response = await api.delete(`/users/event-bookmarks/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Error in removeBookmark:", error);
      throw new Error("Failed to remove bookmark");
    }
  },

  // Search events
  searchEvents: async (searchTerm) => {
    try {
      const response = await api.get(
        `/events?search=${encodeURIComponent(searchTerm)}`,
      );
      const eventsArray = ensureArray(response.data);
      return eventsArray.map(formatEventData).filter(Boolean);
    } catch (error) {
      console.error("Error in searchEvents:", error);
      throw new Error("Failed to search events");
    }
  },
};

export default userEventsApi;