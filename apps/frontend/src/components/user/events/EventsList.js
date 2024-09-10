import React, { useState, useEffect } from 'react';
import { Input, Button, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Search, Filter, Plus, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from 'react-masonry-css';
import EventCard from './EventCard';
import EventDetailsModal from './EventDetailsModal';
import EventShareModal from './EventShareModal';
import { filterEvents } from '../../../utils/eventHelpers';

const EventsList = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchEvents = () => {
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      setEvents(storedEvents);
    };

    fetchEvents();
    const intervalId = setInterval(fetchEvents, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = filterEvents(events, searchTerm, activeTab === 'all' ? {} : { type: activeTab });
    setFilteredEvents(filtered);
  }, [searchTerm, events, activeTab]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleJoinEvent = (eventId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedParticipants = Array.isArray(event.participants) ? [...event.participants, userId] : [userId];
        return { ...event, participants: updatedParticipants };
      }
      return event;
    });
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleShareEvent = (event) => {
    setSelectedEvent(event);
    setIsShareModalOpen(true);
  };

  const isUserJoined = (event) => {
    return Array.isArray(event.participants) && event.participants.includes(userId);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6 rounded-lg shadow-md mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to UniConnect Events</h1>
        <p className="mb-4">Discover, join, and connect through exciting events!</p>
        <div className="flex space-x-4">
         
          <Button color="primary" startContent={<TrendingUp size={20} />}>
            Trending Events
          </Button>
        </div>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-grow max-w-xl">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            startContent={<Search className="text-gray-400" size={20} />}
            className="w-full"
          />
        </div>
        <Button color="primary" startContent={<Filter size={20} />}>
          Filters
        </Button>
      </div>

      <Tabs 
        aria-label="Event categories" 
        selectedKey={activeTab} 
        onSelectionChange={setActiveTab}
        className="mb-6"
      >
        <Tab key="all" title="All Events" />
        <Tab key="joined" title="Joined Events" />
        <Tab key="bookmarked" title="Bookmarked Events" />
      </Tabs>

      <AnimatePresence>
        {filteredEvents.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 dark:text-gray-400"
          >
            No events found.
          </motion.p>
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
                  isJoined={isUserJoined(event)}
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
        isJoined={selectedEvent && isUserJoined(selectedEvent)}
      />
      <EventShareModal
        event={selectedEvent}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

export default EventsList;