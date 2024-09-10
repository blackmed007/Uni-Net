import React from 'react';
import { Card, CardBody, Button, Chip, Tooltip } from "@nextui-org/react";
import { Calendar, Clock, MapPin, Users, Info } from "lucide-react";
import { motion } from "framer-motion";

const EventCard = ({ event, onViewDetails, onJoin, isJoined }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Conference': 'bg-blue-500',
      'Workshop': 'bg-green-500',
      'Seminar': 'bg-yellow-500',
      'Webinar': 'bg-purple-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 hover:shadow-lg transition-all duration-300">
        <CardBody className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-violet-700 dark:text-violet-300">{event.name}</h3>
            <Chip color="primary" variant="flat" className={`${getEventTypeColor(event.type)} text-white`}>
              {event.type}
            </Chip>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {event.description || 'No description available.'}
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-2 text-violet-500" size={18} />
              <span>{event.date || 'Date not specified'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-2 text-violet-500" size={18} />
              <span>{event.time || 'Time not specified'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="mr-2 text-violet-500" size={18} />
              <span>{event.location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="mr-2 text-violet-500" size={18} />
              <span>{event.participants ? event.participants.length : 0} / {event.maxParticipants || '∞'} participants</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Tooltip content="View event details">
              <Button color="secondary" variant="flat" onPress={() => onViewDetails(event)}>
                View Details
              </Button>
            </Tooltip>
            <Tooltip content={isJoined ? "You've joined this event" : "Join this event"}>
              <Button
                color={isJoined ? "success" : "primary"}
                variant={isJoined ? "flat" : "solid"}
                onPress={() => onJoin(event.id)}
                disabled={isJoined}
              >
                {isJoined ? "Joined" : "Join Event"}
              </Button>
            </Tooltip>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default EventCard;