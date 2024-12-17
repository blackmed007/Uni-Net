import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";

const CreateStudyGroupModal = ({ isOpen, onClose, onSave }) => {
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    university: '',
    description: '',
    status: 'Active',
    maxMembers: '',
  });

  const handleChange = (key, value) => {
    setNewGroup(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({
      ...newGroup,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      members: [],
    });
    setNewGroup({
      name: '',
      subject: '',
      university: '',
      description: '',
      status: 'Active',
      maxMembers: '',
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
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
            Create New Study Group
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              label="Group Name"
              placeholder="Enter group name"
              value={newGroup.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <div className="flex gap-4">
              <Select
                label="Subject"
                placeholder="Select subject"
                selectedKeys={newGroup.subject ? [newGroup.subject] : []}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="flex-1"
              >
                <SelectItem key="Mathematics" value="Mathematics">Mathematics</SelectItem>
                <SelectItem key="Physics" value="Physics">Physics</SelectItem>
                <SelectItem key="Computer Science" value="Computer Science">Computer Science</SelectItem>
                <SelectItem key="Literature" value="Literature">Literature</SelectItem>
              </Select>
              <Select
                label="University"
                placeholder="Select university"
                selectedKeys={newGroup.university ? [newGroup.university] : []}
                onChange={(e) => handleChange('university', e.target.value)}
                className="flex-1"
              >
                <SelectItem key="University A" value="University A">University A</SelectItem>
                <SelectItem key="University B" value="University B">University B</SelectItem>
                <SelectItem key="University C" value="University C">University C</SelectItem>
              </Select>
            </div>
            <Textarea
              label="Description"
              placeholder="Enter group description"
              value={newGroup.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <div className="flex gap-4">
              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={[newGroup.status]}
                onChange={(e) => handleChange('status', e.target.value)}
                className="flex-1"
              >
                <SelectItem key="Active" value="Active">Active</SelectItem>
                <SelectItem key="Inactive" value="Inactive">Inactive</SelectItem>
              </Select>
              <Input
                label="Max Members"
                type="number"
                placeholder="Enter max members"
                value={newGroup.maxMembers}
                onChange={(e) => handleChange('maxMembers', e.target.value)}
                className="flex-1"
              />
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            Create Study Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateStudyGroupModal;