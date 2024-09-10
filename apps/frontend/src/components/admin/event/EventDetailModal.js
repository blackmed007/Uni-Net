import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { Calendar, MapPin, Users, Clock, Tag, User } from "lucide-react";

const EventDetailModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-background text-foreground",
        header: "border-b border-default-200",
        body: "py-6",
        footer: "border-t border-default-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{event.name}</h2>
          <p className="text-default-500">{event.type}</p>
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Date</p>
                    <p className="font-medium">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Time</p>
                    <p className="font-medium">{event.time || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Location</p>
                    <p className="font-medium">{event.location || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Participants</p>
                    <p className="font-medium">{event.participants}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Organizer</p>
                    <p className="font-medium">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Status</p>
                    <p className="font-medium">{event.status}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{event.description || 'No description available.'}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => console.log("Edit event")}>
            Edit Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventDetailModal;