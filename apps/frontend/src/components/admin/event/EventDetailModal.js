import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { Calendar, MapPin, Users, Clock, Tag, User, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const EventDetailModal = ({ isOpen, onClose, event }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (!event) return null;

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/800x400?text=No+Image+Available";
    setIsImageLoading(false);
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 whitespace-normal break-words"
          >
            {event.name}
          </motion.h2>
          <p className="text-gray-400">#{event.id}</p>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {event.image && (
              <div className="relative w-full h-48 mb-4">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <Spinner color="white" />
                  </div>
                )}
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover rounded-lg"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: isImageLoading ? 'none' : 'block' }}
                />
              </div>
            )}
            <Card className="bg-gray-800 border border-gray-700 mb-6">
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 col-span-2">
                    <User className="text-purple-400" size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white break-words whitespace-normal">{event.organizer}</p>
                      <p className="text-sm text-gray-400">{formatEventDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-blue-400" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Date & Time</p>
                      <p className="font-medium text-white whitespace-normal">
                        {formatEventDate(event.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-green-400" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium text-white break-words whitespace-normal">
                        {event.location || 'TBA'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="text-yellow-400" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="font-medium text-white break-words whitespace-normal">
                        {event.type || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-indigo-400" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium text-white break-words whitespace-normal">
                        {event.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-pink-400" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Participants</p>
                      <p className="font-medium text-white">
                        {event.participants?.length || 0} / {event.maxParticipants || 'Unlimited'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="text-orange-400" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Total Views</p>
                      <p className="font-medium text-white">
                        {event.totalViews || 0} view{event.totalViews !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
              <p className="text-gray-300 whitespace-pre-line break-words">
                {event.description || 'No description available.'}
              </p>
            </div>
            {event.agenda && event.agenda.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Agenda</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {event.agenda.map((item, index) => (
                    <li key={index} className="whitespace-pre-line break-words">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Speakers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <img 
                          src={speaker.image || 'https://via.placeholder.com/48?text=Speaker'} 
                          alt={speaker.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/48?text=Speaker";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white break-words whitespace-normal">
                          {speaker.name}
                        </p>
                        <p className="text-sm text-gray-400 break-words whitespace-normal">
                          {speaker.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventDetailModal;