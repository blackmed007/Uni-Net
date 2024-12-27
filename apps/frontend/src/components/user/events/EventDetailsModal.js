import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Progress } from "@nextui-org/react";
import { MapPin, Calendar, Clock, Share2, Users, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const EventDetailsModal = ({ event, isOpen, onClose, onJoin, onShare, isJoined }) => {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const bodyRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const center = {
    lat: 36.1699,
    lng: -115.1398
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (bodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
        setShowScrollArrow(scrollTop + clientHeight < scrollHeight - 20);
      }
    };

    const bodyElement = bodyRef.current;
    if (bodyElement) {
      bodyElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (bodyElement) {
        bodyElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isOpen]);

  if (!event) return null;

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent className="bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800">
        <ModalHeader className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Chip color="primary" className="mb-2">{event.type}</Chip>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
              {event.name}
            </h2>
          </motion.div>
        </ModalHeader>
        <ModalBody ref={bodyRef}>
          <motion.img 
            src={event.image} 
            alt={event.name} 
            className="w-full h-64 object-cover rounded-lg mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2">Event Description</h3>
            <p className="text-gray-300">{event.description}</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center">
              <Calendar className="mr-2 text-primary" size={20} />
              <div>
                <p className="font-semibold">Date</p>
                <p className="text-sm text-gray-300">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-primary" size={20} />
              <div>
                <p className="font-semibold">Time</p>
                <p className="text-sm text-gray-300">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 text-primary" size={20} />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-sm text-gray-300">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 text-primary" size={20} />
              <div>
                <p className="font-semibold">Participants</p>
                <p className="text-sm text-gray-300">
                  {event.participants?.length || 0} / {event.maxParticipants}
                </p>
                <Progress 
                  color="primary" 
                  size="sm" 
                  value={((event.participants?.length || 0) / event.maxParticipants) * 100} 
                  className="mt-1"
                />
              </div>
            </div>
          </motion.div>
          {event.agenda && event.agenda.length > 0 && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-2">Event Agenda</h3>
              <ul className="list-disc list-inside text-gray-300">
                {event.agenda.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </motion.div>
          )}
          {event.speakers && event.speakers.length > 0 && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-2">Speakers</h3>
              <div className="grid grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img src={speaker.image || '/api/placeholder/40/40'} alt={speaker.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-white">{speaker.name}</p>
                      <p className="text-sm text-gray-400">{speaker.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
                onLoad={onLoad}
                options={{
                  styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                  ],
                }}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
                <p className="text-gray-400">Loading map...</p>
              </div>
            )}
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" startContent={<Share2 />} onPress={onShare}>
            Share
          </Button>
          <Button 
            color="primary"
            onPress={() => onJoin(event.id)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            {isJoined ? "Leave Event" : "Join Event"}
          </Button>
        </ModalFooter>
        <AnimatePresence>
          {showScrollArrow && (
            <motion.div
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="animate-bounce text-gray-400" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  );
};

export default EventDetailsModal;