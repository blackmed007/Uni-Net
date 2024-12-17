import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { BookOpen, MapPin, Users, Calendar, Tag, User } from "lucide-react";
import { motion } from "framer-motion";

const StudyGroupDetailModal = ({ isOpen, onClose, group }) => {
  if (!group) return null;

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
            {group.name}
          </motion.h2>
          <p className="text-gray-400">{group.subject}</p>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800 border border-gray-700">
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="text-purple-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Subject</p>
                      <p className="font-medium text-white">{group.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-blue-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">University</p>
                      <p className="font-medium text-white">{group.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-green-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Members</p>
                      <p className="font-medium text-white">{group.members?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-yellow-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Created On</p>
                      <p className="font-medium text-white">{group.createdOn}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="text-pink-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Created By</p>
                      <p className="font-medium text-white">{group.createdBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="text-indigo-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium text-white">{group.status}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
              <p className="text-gray-300">{group.description || 'No description available.'}</p>
            </div>
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

export default StudyGroupDetailModal;