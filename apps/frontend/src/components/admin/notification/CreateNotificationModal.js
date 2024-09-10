import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea, Checkbox } from "@nextui-org/react";

const CreateNotificationModal = ({ isOpen, onClose, onSave }) => {
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'General',
    status: 'Draft',
    recipients: [],
    scheduledDate: '',
    scheduledTime: '',
  });

  const handleChange = (key, value) => {
    setNewNotification(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const scheduledDateTime = newNotification.scheduledDate && newNotification.scheduledTime
      ? `${newNotification.scheduledDate}T${newNotification.scheduledTime}`
      : null;

    onSave({
      ...newNotification,
      date: new Date().toISOString(),
      scheduledDateTime,
    });
    setNewNotification({
      title: '',
      message: '',
      type: 'General',
      status: 'Draft',
      recipients: [],
      scheduledDate: '',
      scheduledTime: '',
    });
    onClose();
  };

  const recipientOptions = [
    { label: 'All Users', value: 'all' },
    { label: 'Students', value: 'students' },
    { label: 'Teachers', value: 'teachers' },
    { label: 'Admins', value: 'admins' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-black dark:text-white">Create New Notification</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            label="Title"
            value={newNotification.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Message"
            value={newNotification.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="mb-4"
          />
          <Select
            label="Type"
            value={newNotification.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="General" value="General" className="text-black dark:text-white">General</SelectItem>
            <SelectItem key="Event" value="Event" className="text-black dark:text-white">Event</SelectItem>
            <SelectItem key="Update" value="Update" className="text-black dark:text-white">Update</SelectItem>
          </Select>
          <Select
            label="Status"
            value={newNotification.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Draft" value="Draft" className="text-black dark:text-white">Draft</SelectItem>
            <SelectItem key="Scheduled" value="Scheduled" className="text-black dark:text-white">Scheduled</SelectItem>
            <SelectItem key="Sent" value="Sent" className="text-black dark:text-white">Sent</SelectItem>
          </Select>
          <div className="flex gap-4 mb-4">
            <Input
              label="Scheduled Date"
              type="date"
              value={newNotification.scheduledDate}
              onChange={(e) => handleChange('scheduledDate', e.target.value)}
              className="flex-1"
            />
            <Input
              label="Scheduled Time"
              type="time"
              value={newNotification.scheduledTime}
              onChange={(e) => handleChange('scheduledTime', e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="mb-4">
            <p className="mb-2 text-black dark:text-white">Recipients:</p>
            {recipientOptions.map((option) => (
              <Checkbox
                key={option.value}
                isSelected={newNotification.recipients.includes(option.value)}
                onValueChange={(isSelected) => {
                  const updatedRecipients = isSelected
                    ? [...newNotification.recipients, option.value]
                    : newNotification.recipients.filter((r) => r !== option.value);
                  handleChange('recipients', updatedRecipients);
                }}
                className="text-black dark:text-white"
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Create Notification
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNotificationModal;