import React, { useState, useEffect, useCallback } from 'react';
import { NextUIProvider, Input, Button, Tabs, Tab } from "@nextui-org/react";
import { Search, Filter, TrendingUp, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from 'react-masonry-css';
import EventCard from '../../components/user/events/EventCard';
import EventDetailsModal from '../../components/user/events/EventDetailsModal';
import EventShareModal from '../../components/user/events/EventShareModal';
import UserEventFilterModal from '../../components/user/events/UserEventFilterModal';
import { filterEvents } from '../../utils/eventHelpers';

const UserEventsPage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    date: '',
    city: '',
    university: '',
  });
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedEvents') || '[]');
    setBookmarkedEvents(storedBookmarks);
    const storedJoinedEvents = JSON.parse(localStorage.getItem('joinedEvents') || '[]');
    setJoinedEvents(storedJoinedEvents);
  }, []);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleJoinEvent = (eventId) => {
    const eventToJoin = events.find(event => event.id === eventId);
    if (eventToJoin) {
      if (eventToJoin.participants.length >= eventToJoin.maxParticipants) {
        return;
      }
      if (eventToJoin.status === "Cancelled") {
        return;
      }
      setJoinedEvents(prev => {
        const newJoinedEvents = prev.includes(eventId)
          ? prev.filter(id => id !== eventId)
          : [...prev, eventId];
        localStorage.setItem('joinedEvents', JSON.stringify(newJoinedEvents));
        return newJoinedEvents;
      });
      const updatedEvents = events.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              participants: event.participants.includes(user.id)
                ? event.participants.filter(id => id !== user.id)
                : [...event.participants, user.id]
            }
          : event
      );
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const handleShareEvent = (event) => {
    setSelectedEvent(event);
    setIsShareModalOpen(true);
  };

  const handleBookmarkEvent = (eventId) => {
    setBookmarkedEvents(prev => {
      const newBookmarks = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('bookmarkedEvents', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isEventBookmarked = (eventId) => {
    return bookmarkedEvents.includes(eventId);
  };

  const isEventJoined = (eventId) => {
    return joinedEvents.includes(eventId);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <NextUIProvider>
      <div className="space-y-6 p-6 bg-black min-h-screen text-white pt-24">
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
    <Button color="secondary" startContent={<TrendingUp size={20} />}>
      Trending Events
    </Button>
  </div>
</motion.div>


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
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto -ml-4"
              columnClassName="pl-4 bg-clip-padding"
            >
              {filteredEvents.map(event => (
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
          )}
        </AnimatePresence>

        <EventDetailsModal
          event={selectedEvent}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onJoin={handleJoinEvent}
          onShare={() => {
            setIsDetailsModalOpen(false);
            setIsShareModalOpen(true);
          }}
          isJoined={selectedEvent ? isEventJoined(selectedEvent.id) : false}
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
      </div>
    </NextUIProvider>
  );
};

export default UserEventsPage;