import React from 'react';
import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { Clock, MapPin, Users, Bookmark, Check, User } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const EventCard = ({ event, onViewDetails, onJoin, onBookmark, isBookmarked, isJoined }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const bookmarkVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1] },
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Workshop': 'bg-purple-500',
      'Seminar': 'bg-blue-500',
      'Conference': 'bg-pink-500',
      'Social': 'bg-green-500',
      'Concert': 'bg-yellow-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getMonthAbbreviation = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' }).toUpperCase();
  };

  const getDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const handleBookmark = () => {
    onBookmark(event.id);
  };

  // Text truncation helper function
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className="relative"
    >
      <Card className="bg-black text-white overflow-hidden">
        <div className="absolute top-0 left-0 bg-yellow-500 text-black p-2 z-10 flex flex-col items-center justify-center w-16 h-16">
          <div className="text-xs font-bold">{getMonthAbbreviation(event.date)}</div>
          <div className="text-2xl font-bold">{getDay(event.date)}</div>
        </div>
        <div className="absolute top-2 right-2 z-20">
          <motion.div
            variants={bookmarkVariants}
            initial="initial"
            whileTap="animate"
          >
            <Button
              isIconOnly
              color={isBookmarked ? "success" : "primary"}
              variant="light"
              onPress={handleBookmark}
              className="bg-opacity-50 hover:bg-opacity-75"
            >
              <Bookmark className={isBookmarked ? "fill-current" : ""} />
            </Button>
          </motion.div>
        </div>
        <div onClick={() => onViewDetails(event)} className="cursor-pointer">
          <img 
            src={event.image} 
            alt={event.name} 
            className="w-full h-48 object-cover"
          />
          <CardBody className="p-4">
            <div className="mb-2">
              <Chip color="primary" variant="flat" className={`${getEventTypeColor(event.type)} text-white`}>
                {event.type}
              </Chip>
            </div>
            <h3 className="text-xl font-bold mb-2">{truncateText(event.name, 25)}</h3>
            <p className="text-gray-300 text-sm mb-4">
              {truncateText(event.description, 30)}
            </p>
            
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <Clock className="mr-2 text-gray-500" size={16} />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric'
                  })} • {event.time || 'Time not specified'}
                </span>
              </div>
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <MapPin className="mr-2 text-gray-500" size={16} />
              <span>{truncateText(event.location, 20)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mb-4">
              <User className="mr-2 text-gray-500" size={16} />
              <span>{truncateText(event.organizer, 15)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                <Users className="inline mr-1 text-gray-500" size={16} />
                {event.participants?.length || 0}/{event.maxParticipants} participants
              </span>
              <Button
                color={isJoined ? "success" : "primary"}
                variant="solid"
                onPress={() => onJoin(event.id)}
                size="sm"
                className={isJoined ? "bg-green-500 text-white" : "bg-white text-black hover:bg-gray-200"}
              >
                {isJoined ? <Check size={16} className="mr-1" /> : null}
                {isJoined ? "Joined" : "Join Event"}
              </Button>
            </div>
          </CardBody>
        </div>
      </Card>
    </motion.div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    organizer: PropTypes.string.isRequired,
    participants: PropTypes.array,
    maxParticipants: PropTypes.number.isRequired,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool,
  isJoined: PropTypes.bool,
};

export default EventCard;