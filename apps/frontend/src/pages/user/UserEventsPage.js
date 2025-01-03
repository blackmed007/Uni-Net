import React, { useState, useEffect, useCallback } from 'react';
import { NextUIProvider, Input, Button, Tabs, Tab, Tooltip, Pagination } from "@nextui-org/react";
import { Search, Filter, TrendingUp, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from 'react-masonry-css';
import EventCard from '../../components/user/events/EventCard';
import EventDetailsModal from '../../components/user/events/EventDetailsModal';
import EventShareModal from '../../components/user/events/EventShareModal';
import EventJoinMessage from '../../components/user/events/EventJoinMessage';
import UserEventFilterModal from '../../components/user/events/UserEventFilterModal';
import { filterEvents } from '../../utils/eventHelpers';

const EVENTS_PER_PAGE = 12;

const UserEventsPage = () => {
  // User and events state
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    date: '',
    city: '',
    university: '',
  });

  // Centralized message state
  const [messageState, setMessageState] = useState({
    isVisible: false,
    message: "",
    timeoutId: null
  });

  // Load initial data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedEvents') || '[]');
    const storedJoinedEvents = JSON.parse(localStorage.getItem('joinedEvents') || '[]');
    
    setUser(userData);
    setEvents(storedEvents);
    setBookmarkedEvents(storedBookmarks);
    setJoinedEvents(storedJoinedEvents);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, filters]);

  // Filter events based on search, filters, and active tab
  const filterEventsList = useCallback(() => {
    let filtered = filterEvents(events, searchTerm, filters);
    
    if (activeTab === 'bookmarked') {
      filtered = filtered.filter(event => bookmarkedEvents.includes(event.id));
    } else if (activeTab === 'joined') {
      filtered = filtered.filter(event => joinedEvents.includes(event.id));
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters, activeTab, bookmarkedEvents, joinedEvents]);

  useEffect(() => {
    filterEventsList();
  }, [filterEventsList]);

  // Get current page events
  const getCurrentPageEvents = useCallback(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage]);

  // Message handlers
  const showMessage = useCallback((message) => {
    if (messageState.timeoutId) {
      clearTimeout(messageState.timeoutId);
    }

    setMessageState(prev => ({
      ...prev,
      isVisible: false,
      message: '',
      timeoutId: null
    }));

    setTimeout(() => {
      setMessageState({
        isVisible: true,
        message,
        timeoutId: null
      });
    }, 50);
  }, [messageState]);

  const handleCloseMessage = useCallback(() => {
    setMessageState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = useCallback((event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(null);
    handleCloseMessage();
  }, [handleCloseMessage]);

  const handleJoinEvent = useCallback((eventId) => {
    const eventToJoin = events.find(event => event.id === eventId);
    
    if (!eventToJoin) return;

    const isCurrentlyJoined = joinedEvents.includes(eventId);

    // Check event status before allowing join
    switch (eventToJoin.status) {
      case "Cancelled":
        showMessage("Sorry, this event has been cancelled. Keep an eye out for similar events coming up!");
        return;
      case "Completed":
        showMessage("This event has already taken place. Check out our upcoming events or join our waitlist to be notified about similar events in the future.");
        return;
      case "Upcoming":
        if (!isCurrentlyJoined) {
          showMessage("Great choice! Join now to secure your spot. We'll send you a reminder as the event date approaches.");
        }
        break;
      case "Ongoing":
        if (!isCurrentlyJoined) {
          showMessage("This event is happening now! Join quickly to participate.");
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

    setJoinedEvents(prev => {
      const newJoinedEvents = isCurrentlyJoined
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('joinedEvents', JSON.stringify(newJoinedEvents));
      return newJoinedEvents;
    });

    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const newParticipants = isCurrentlyJoined
          ? event.participants.filter(id => id !== user.id)
          : [...event.participants, user.id];
        const updatedEvent = {
          ...event,
          participants: newParticipants
        };
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent(updatedEvent);
        }
        return updatedEvent;
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // Reset message state first
    setMessageState({
      isVisible: false,
      message: "",
      timeoutId: null
    });

    // Show new message after a small delay
    setTimeout(() => {
      if (isCurrentlyJoined) {
        showMessage("You have successfully left the event. We hope to see you at future events!");
      } else {
        const isUpcoming = eventToJoin.status === "Upcoming";
        showMessage(
          isUpcoming
          ? "You're all set! We'll email you the event details and reminders. Remember to bring your student ID and arrive 10 minutes early."
          : "You've successfully joined! The event is happening now - head over to the location. Don't forget your student ID!"
        );
      }
    }, 50);
  }, [events, joinedEvents, user, selectedEvent, showMessage]);

  const handleBookmarkEvent = useCallback((eventId) => {
    setBookmarkedEvents(prev => {
      const newBookmarks = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('bookmarkedEvents', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const handleShareEvent = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  // Event status checkers
  const isEventBookmarked = useCallback((eventId) => {
    return bookmarkedEvents.includes(eventId);
  }, [bookmarkedEvents]);

  const isEventJoined = useCallback((eventId) => {
    return joinedEvents.includes(eventId);
  }, [joinedEvents]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

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
          <div className="flex space-x-4">
            <Tooltip content="Coming Soon!" placement="bottom">
              <Button 
                color="secondary" 
                startContent={<TrendingUp size={20} />}
                isDisabled
                className="opacity-50 cursor-not-allowed"
              >
                Trending Events
              </Button>
            </Tooltip>
            <span className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 font-medium mt-2">
              Coming Soon!
            </span>
          </div>
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
          <Button color="primary" onPress={() => setIsFilterModalOpen(true)} startContent={<Filter size={20} />}>
            Filters
          </Button>
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
              <p className="text-xl text-gray-500">No events found. Check back later for new events!</p>
            </motion.div>
          ) : (
            <>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4"
                columnClassName="pl-4 bg-clip-padding"
              >
                {getCurrentPageEvents().map(event => (
                  <div key={event.id} className="mb-4">
                    <EventCard
                      event={event}
                      onViewDetails={handleViewDetails}
                      onJoin={handleJoinEvent}
                      onBookmark={handleBookmarkEvent}
                      isBookmarked={isEventBookmarked(event.id)}
                      isJoined={isEventJoined(event.id)}
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
          onClose={handleCloseDetailsModal}
          onJoin={handleJoinEvent}
          onShare={handleShareEvent}
          isJoined={selectedEvent ? isEventJoined(selectedEvent.id) : false}
        />

        <EventShareModal
          event={selectedEvent}
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
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