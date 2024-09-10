import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { Bell, Calendar, Users, Tag } from "lucide-react";

const NotificationDetailModal = ({ isOpen, onClose, notification }) => {
  if (!notification) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-black dark:text-white">{notification.title}</h2>
          <p className="text-default-500">{notification.type}</p>
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Bell className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Type</p>
                    <p className="font-medium text-black dark:text-white">{notification.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Date</p>
                    <p className="font-medium text-black dark:text-white">{notification.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Recipients</p>
                    <p className="font-medium text-black dark:text-white">{notification.recipients.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Status</p>
                    <p className="font-medium text-black dark:text-white">{notification.status}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Message</h3>
            <p className="text-black dark:text-white">{notification.message}</p>
          </div>
          {notification.scheduledDate && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Scheduled Date</h3>
              <p className="text-black dark:text-white">{new Date(notification.scheduledDate).toLocaleString()}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => console.log("Edit notification")}>
            Edit Notification
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationDetailModal;