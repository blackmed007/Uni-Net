import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react";
import { Calendar, MapPin, Users, Clock, Tag, User } from "lucide-react";

const EventDetailsModal = ({ event, isOpen, onClose, onJoin, isJoined }) => {
  if (!event) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{event.name}</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
              <div className="flex flex-wrap gap-2">
                <Chip color="primary" variant="flat">{event.type}</Chip>
                <Chip color="secondary" variant="flat">{event.status}</Chip>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-primary" size={20} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-primary" size={20} />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-primary" size={20} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 text-primary" size={20} />
                  <span>{event.participants.length} / {event.maxParticipants} participants</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 text-primary" size={20} />
                  <span>{event.organizer}</span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          {isJoined ? (
            <Button color="success" variant="flat" disabled>
              Joined
            </Button>
          ) : (
            <Button color="primary" onPress={() => onJoin(event.id)}>
              Join Event
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventDetailsModal;