import React, { useState, useEffect, useCallback } from "react";
import {
  NextUIProvider,
  Input,
  Button,
  Tabs,
  Tab,
  Tooltip,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { Search, Filter, TrendingUp, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";
import EventCard from "../../components/user/events/EventCard";
import EventDetailsModal from "../../components/user/events/EventDetailsModal";
import EventShareModal from "../../components/user/events/EventShareModal";
import EventJoinMessage from "../../components/user/events/EventJoinMessage";
import UserEventFilterModal from "../../components/user/events/UserEventFilterModal";
import { filterEvents } from "../../utils/eventHelpers";
import userEventsApi from "../../services/usersevents.api";

const EVENTS_PER_PAGE = 12;

const UserEventsPage = () => {
  // State for user and events
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    date: "",
    city: "",
    university: "",
  });

  // Message state
  const [messageState, setMessageState] = useState({
    isVisible: false,
    message: "",
  });

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [allEvents, userEvents, bookmarks] = await Promise.all([
          userEventsApi.getAllEvents(),
          userEventsApi.getUserEvents(),
          userEventsApi.getUserBookmarks(),
        ]);

        setEvents(allEvents);
        setJoinedEvents(userEvents.map((event) => event.id));
        setBookmarkedEvents(bookmarks.map((eventBookmark) => eventBookmark.id));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter events based on search, filters, and active tab
  useEffect(() => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply tab filter
    switch (activeTab) {
      case "joined":
        filtered = filtered.filter((event) => joinedEvents.includes(event.id));
        break;
      case "bookmarked":
        filtered = filtered.filter((event) =>
          bookmarkedEvents.includes(event.id),
        );
        break;
      default:
        break;
    }

    // Apply additional filters
    if (Object.values(filters).some((value) => value)) {
      filtered = filterEvents(filtered, searchTerm, filters);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [events, searchTerm, activeTab, filters, joinedEvents, bookmarkedEvents]);

  // Message handlers
  const showMessage = useCallback((message) => {
    setMessageState({ isVisible: false, message: "" });
    setTimeout(() => {
      setMessageState({ isVisible: true, message });
    }, 50);
  }, []);

  const handleCloseMessage = useCallback(() => {
    setMessageState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = useCallback((event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  }, []);

  const handleJoinEvent = useCallback(
    async (eventId) => {
      try {
        const eventToJoin = events.find(event => event.id === eventId);
        const isCurrentlyJoined = joinedEvents.includes(eventId);

        if (!eventToJoin) {
          showMessage("Event not found.");
          return;
        }

        // Check event status before allowing join
        switch (eventToJoin.status) {
          case "Cancelled":
            showMessage("Sorry, this event has been cancelled. Keep an eye out for similar events coming up!");
            return;
          case "Completed":
            showMessage("Sorry This event Either has already taken place or Reached Max PARTICIPANTS! ");
            return;
          case "Upcoming":
            if (!isCurrentlyJoined) {
              showMessage("Great choice! Join now to secure your spot. We'll send you a reminder as the event date approaches.");
            }
            break;
          case "Ongoing":
            if (!isCurrentlyJoined) {
              showMessage("This event is happening ! Pay Attention to Date/Time . Happy event .");
            }
            break;
          default:
            showMessage("Unable to join event at this time. Please try again later.");
            return;
        }

        if (eventToJoin.participants.length >= eventToJoin.maxParticipants) {
          showMessage("Sorry, this event is already full. Join our waitlist to be notified if a spot opens up!");
          return;
        }

        if (isCurrentlyJoined) {
          await userEventsApi.leaveEvent(eventId);
          setJoinedEvents((prev) => prev.filter((id) => id !== eventId));
          showMessage("You have successfully left the event. We hope to see you at future events!");
        } else {
          await userEventsApi.joinEvent(eventId);
          setJoinedEvents((prev) => [...prev, eventId]);
          const isUpcoming = eventToJoin.status === "Upcoming";
          showMessage(
            isUpcoming
              ? "You're all set! We'll email you the event details and reminders. Remember to bring your student ID and arrive 10 minutes early."
              : "You've successfully joined! This event is happening ! Pay Attention to Date/Time . Happy event. Don't forget your student ID!"
          );
        }

        // Refresh events list
        const updatedEvents = await userEventsApi.getAllEvents();
        setEvents(updatedEvents);
      } catch (err) {
        showMessage("An error occurred. Please try again later.");
        console.error("Error joining/leaving event:", err);
      }
    },
    [events, joinedEvents, showMessage],
  );

  const handleBookmarkEvent = useCallback(
    async (eventId) => {
      try {
        const isCurrentlyBookmarked = bookmarkedEvents.includes(eventId);

        if (isCurrentlyBookmarked) {
          await userEventsApi.removeBookmark(eventId);
          setBookmarkedEvents((prev) => prev.filter((id) => id !== eventId));
        } else {
          await userEventsApi.addBookmark(eventId);
          setBookmarkedEvents((prev) => [...prev, eventId]);
        }
      } catch (err) {
        showMessage("An error occurred while updating bookmark.");
        console.error("Error updating bookmark:", err);
      }
    },
    [bookmarkedEvents, showMessage],
  );

  const handleShareEvent = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  // Get current page events
  const getCurrentPageEvents = useCallback(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h2 className="text-xl mb-4">Error loading events</h2>
        <p className="text-red-400">{error}</p>
        <Button
          color="primary"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <NextUIProvider>
      <div className="space-y-6 p-6 bg-black min-h-screen text-white pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-lg shadow-md mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            UniConnect Events
          </h1>
          <p className="mb-4 text-white">
            Discover, join, and connect through exciting events!
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            startContent={<Search className="text-gray-400" size={20} />}
            className="w-full sm:w-1/2"
          />
        </div>

        {/* Tabs */}
        <Tabs
          aria-label="Event categories"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="mb-6"
          color="secondary"
          variant="underlined"
        >
          <Tab key="all" title="All Events" />
          <Tab key="joined" title="Joined Events" />
          <Tab key="bookmarked" title="Bookmarked Events" />
        </Tabs>

        {/* Events Grid */}
        <AnimatePresence>
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10"
            >
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">
                No events found. Check back later for new events!
              </p>
            </motion.div>
          ) : (
            <>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
              >
                {getCurrentPageEvents().map((event) => (
                  <div key={event.id} className="mb-4">
                    <EventCard
                      event={event}
                      onViewDetails={handleViewDetails}
                      onJoin={handleJoinEvent}
                      onBookmark={handleBookmarkEvent}
                      isBookmarked={bookmarkedEvents.includes(event.id)}
                      isJoined={joinedEvents.includes(event.id)}
                    />
                  </div>
                ))}
              </Masonry>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination
                  total={Math.ceil(filteredEvents.length / EVENTS_PER_PAGE)}
                  page={currentPage}
                  onChange={setCurrentPage}
                  color="secondary"
                  showControls
                  className="gradient-text"
                />
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Modals */}
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onJoin={handleJoinEvent}
          onShare={handleShareEvent}
          isJoined={
            selectedEvent ? joinedEvents.includes(selectedEvent.id) : false
          }
        />

        <EventShareModal
          event={selectedEvent}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        <UserEventFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={setFilters}
          initialFilters={filters}
        />

        {/* Global Message */}
        <EventJoinMessage
          message={messageState.message}
          isVisible={messageState.isVisible}
          onClose={handleCloseMessage}
        />
      </div>
    </NextUIProvider>
  );
};

export default UserEventsPage;