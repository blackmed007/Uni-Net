import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Progress } from "@nextui-org/react";
import { MapPin, Calendar, Clock, Share2, Users, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import PropTypes from 'prop-types';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA54yGS01UI1divw8YIahs3Js0BtYrj-6M';
const CHARS_PER_LINE = 100;
const LOCATION_CHARS_PER_LINE = 30;

const EventDetailsModal = ({ event, isOpen, onClose, onJoin, onShare, isJoined }) => {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullLocation, setShowFullLocation] = useState(false);
  const bodyRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
  });

  // Format text into lines
  const formatTextToLines = (text) => {
    if (!text) return [];
    let words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + ' ' + word).length <= CHARS_PER_LINE) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Format location text
  const formatLocationText = (location) => {
    if (!location) return '';
    
    const lines = [];
    let remainingText = location;

    while (remainingText.length > 0) {
      if (remainingText.length <= LOCATION_CHARS_PER_LINE) {
        lines.push(remainingText);
        break;
      }

      lines.push(remainingText.substring(0, LOCATION_CHARS_PER_LINE));
      remainingText = remainingText.substring(LOCATION_CHARS_PER_LINE);
    }

    return lines;
  };

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!isLoaded || !event?.location) return;

      try {
        const geocoder = new window.google.maps.Geocoder();
        const fullAddress = `${event.location}${event.location.toLowerCase().includes('poland') ? '' : ', Poland'}`;
        
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === 'OK') {
              resolve(results[0]);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        
        setCoordinates({ lat, lng });
        setMapError(null);
      } catch (error) {
        console.error('Geocoding error:', error);
        setMapError('Location could not be found on the map');
        setCoordinates(null);
      }
    };

    if (isLoaded && event) {
      geocodeAddress();
    }
  }, [isLoaded, event]);

  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const onLoad = useCallback((map) => {
    if (!coordinates) return;
    
    mapRef.current = map;
    map.setZoom(15);
    map.setCenter(coordinates);
  }, [coordinates]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }, { lightness: 13 }]
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }]
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#08304b" }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#0c4152" }, { lightness: 5 }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#0b434f" }, { lightness: 25 }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{ color: "#0b3d51" }, { lightness: 16 }]
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ color: "#146474" }]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#021019" }]
      },
    ],
  };

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

  const renderMap = () => {
    if (loadError) {
      return (
        <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
          <p className="text-red-400">Error loading map: {loadError.message}</p>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
          <p className="text-gray-400">Loading map...</p>
        </div>
      );
    }

    if (mapError) {
      return (
        <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
          <p className="text-red-400">{mapError}</p>
        </div>
      );
    }

    if (!coordinates) {
      return (
        <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
          <p className="text-gray-400">Location not available</p>
        </div>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <MarkerF
          position={coordinates}
          title={event.location}
        />
      </GoogleMap>
    );
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
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600 line-clamp-2">
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
            <div className="relative">
              <div 
                className={`text-gray-300 space-y-2 ${!showFullDescription ? 'line-clamp-3' : ''}`}
              >
                {formatTextToLines(event.description)
                  .map((line, index) => (
                    <p key={index} className="whitespace-pre-wrap break-words">
                      {line}
                    </p>
                  ))}
              </div>
              {event.description && event.description.length > 150 && (
                <div className="mt-2">
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    className="h-6 min-w-0 p-0"
                    onPress={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </Button>
                </div>
              )}
            </div>
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
                <p className="text-sm text-gray-300">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-primary" size={20} />
              <div>
                <p className="font-semibold">Time</p>
                <p className="text-sm text-gray-300">
                  {event.time || 'Time not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="mr-2 text-primary mt-1" size={20} />
              <div className="flex-1">
                <p className="font-semibold">Location</p>
                <div className="relative">
                  <div 
                    className={`text-sm text-gray-300 space-y-1 ${!showFullLocation ? 'line-clamp-2' : ''}`}
                  >
                    {formatLocationText(event.location).map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  {event.location && formatLocationText(event.location).length > 2 && (
                    <Button
                      color="primary"
                      variant="light"
                      size="sm"
                      className="mt-2 h-6 min-w-0 p-0"
                      onPress={() => setShowFullLocation(!showFullLocation)}
                    >
                      {showFullLocation ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </div>
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
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {event.agenda.map((item, index) => (
                  <li key={index} className="whitespace-pre-wrap break-words line-clamp-2">{item}</li>
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
                    <img 
                      src={speaker.image || '/api/placeholder/40/40'} 
                      alt={speaker.name} 
                      className="w-10 h-10 rounded-full" 
                    />
                    <div className="overflow-hidden">
                      <p className="font-medium text-white truncate">{speaker.name}</p>
                      <p className="text-sm text-gray-400 truncate">{speaker.role}</p>
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
            {renderMap()}
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

EventDetailsModal.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    participants: PropTypes.array,
    maxParticipants: PropTypes.number.isRequired,
    organizer: PropTypes.string,
    agenda: PropTypes.array,
    speakers: PropTypes.array,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  isJoined: PropTypes.bool,
};

export default EventDetailsModal;