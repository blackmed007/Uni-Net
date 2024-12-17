import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { Bell, Calendar, Users, Tag } from "lucide-react";
import { motion } from "framer-motion";

const NotificationDetailModal = ({ isOpen, onClose, notification }) => {
  if (!notification) return null;

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
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
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            {notification.title}
          </motion.h2>
          <p className="text-gray-400">{notification.type}</p>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800 border border-gray-700 mb-4">
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="text-purple-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="font-medium text-white">{notification.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-blue-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-medium text-white">{formatDateTime(notification.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-green-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Recipients</p>
                      <p className="font-medium text-white">{notification.recipients.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="text-yellow-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium text-white">{notification.status}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Message</h3>
              <p className="text-gray-300">{notification.message}</p>
            </div>
            {notification.scheduledDateTime && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Scheduled Date</h3>
                <p className="text-gray-300">{formatDateTime(notification.scheduledDateTime)}</p>
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

export default NotificationDetailModal;