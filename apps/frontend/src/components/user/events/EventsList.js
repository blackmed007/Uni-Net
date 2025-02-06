import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import Masonry from 'react-masonry-css';
import EventCard from './EventCard';
import EventDetailsModal from './EventDetailsModal';
import EventShareModal from './EventShareModal';

const EventsList = ({ 
  events = [], 
  onJoinEvent, 
  onBookmarkEvent,
  isEventJoined,
  isEventBookmarked,
  isLoading,
  error
}) => {
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleShareEvent = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-10"
      >
        <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-500">No events found. Check back later for new events!</p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {events.map(event => (
            <div key={event.id} className="mb-4">
              <EventCard
                event={event}
                onViewDetails={handleViewDetails}
                onJoin={onJoinEvent}
                onBookmark={onBookmarkEvent}
                isBookmarked={isEventBookmarked(event.id)}
                isJoined={isEventJoined(event.id)}
              />
            </div>
          ))}
        </Masonry>
      </AnimatePresence>

      {/* Modals */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onJoin={onJoinEvent}
        onShare={handleShareEvent}
        isJoined={selectedEvent ? isEventJoined(selectedEvent.id) : false}
      />

      <EventShareModal
        event={selectedEvent}
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
      />
    </>
  );
};

// Prop Types
EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    datetime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    event_type: PropTypes.string.isRequired,
    event_status: PropTypes.string.isRequired,
    max_participants: PropTypes.number.isRequired,
    event_thumbnail: PropTypes.string.isRequired,
  })),
  onJoinEvent: PropTypes.func.isRequired,
  onBookmarkEvent: PropTypes.func.isRequired,
  isEventJoined: PropTypes.func.isRequired,
  isEventBookmarked: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

// Default Props
EventsList.defaultProps = {
  events: [],
  isLoading: false,
  error: null,
};

export default EventsList;