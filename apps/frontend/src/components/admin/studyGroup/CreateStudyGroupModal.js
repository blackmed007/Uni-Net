import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

const CreateStudyGroupModal = ({ isOpen, onClose, onSave }) => {
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    university: '',
    description: '',
    status: 'Upcoming',
  });

  const handleChange = (key, value) => {
    setNewGroup(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({
      ...newGroup,
      members: 1,
      createdOn: new Date().toISOString().split('T')[0],
      createdBy: 'Current User', // Replace with actual user data
    });
    setNewGroup({
      name: '',
      subject: '',
      university: '',
      description: '',
      status: 'Upcoming',
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Create New Study Group</ModalHeader>
        <ModalBody>
          <Input
            label="Group Name"
            value={newGroup.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Subject"
            value={newGroup.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="mb-4"
          />
          <Input
            label="University"
            value={newGroup.university}
            onChange={(e) => handleChange('university', e.target.value)}
            className="mb-4"
          />
          <Select
            label="Status"
            value={newGroup.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Upcoming" value="Upcoming" className="text-black dark:text-white">Upcoming</SelectItem>
            <SelectItem key="Open" value="Open" className="text-black dark:text-white">Open</SelectItem>
            <SelectItem key="Closed" value="Closed" className="text-black dark:text-white">Closed</SelectItem>
            <SelectItem key="Cancelled" value="Cancelled" className="text-black dark:text-white">Cancelled</SelectItem>
          </Select>
          <Textarea
            label="Description"
            value={newGroup.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="mb-4"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Create Study Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateStudyGroupModal;