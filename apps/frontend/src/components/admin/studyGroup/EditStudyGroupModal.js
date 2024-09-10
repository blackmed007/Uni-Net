import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

const EditStudyGroupModal = ({ isOpen, onClose, group, onSave }) => {
  const [editedGroup, setEditedGroup] = useState(group || {});

  useEffect(() => {
    setEditedGroup(group || {});
  }, [group]);

  const handleChange = (key, value) => {
    setEditedGroup(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedGroup);
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
        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Edit Study Group</ModalHeader>
        <ModalBody>
          <Input
            label="Group Name"
            value={editedGroup.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Subject"
            value={editedGroup.subject || ''}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="mb-4"
          />
          <Input
            label="University"
            value={editedGroup.university || ''}
            onChange={(e) => handleChange('university', e.target.value)}
            className="mb-4"
          />
          <Select
            label="Status"
            selectedKeys={editedGroup.status ? [editedGroup.status] : []}
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
            value={editedGroup.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="mb-4"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditStudyGroupModal;