import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { Calendar, MapPin, Users, Clock, Tag, User, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const EventDetailModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

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
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            {event.name}
          </motion.h2>
          <p className="text-gray-400">{event.type}</p>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {event.image && (
              <img src={event.image} alt={event.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <Card className="bg-gray-800 border border-gray-700">
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-purple-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-medium text-white">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-blue-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p className="font-medium text-white">{event.time || 'TBA'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-green-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium text-white">{event.location || 'TBA'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-yellow-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Participants</p>
                      <p className="font-medium text-white">{event.participants?.length || 0} / {event.maxParticipants || 'Unlimited'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="text-pink-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Organizer</p>
                      <p className="font-medium text-white">{event.organizer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="text-indigo-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium text-white">{event.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="text-orange-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Total Views</p>
                      <p className="font-medium text-white">{event.totalViews || 0}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
              <p className="text-gray-300">{event.description || 'No description available.'}</p>
            </div>
            {event.agenda && event.agenda.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Agenda</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {event.agenda.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {event.speakers && event.speakers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Speakers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <img src={speaker.image || 'https://via.placeholder.com/40'} alt={speaker.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-white">{speaker.name}</p>
                        <p className="text-sm text-gray-400">{speaker.role}</p>
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