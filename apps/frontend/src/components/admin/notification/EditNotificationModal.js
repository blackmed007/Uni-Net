import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea, Checkbox } from "@nextui-org/react";

const EditNotificationModal = ({ isOpen, onClose, notification, onSave }) => {
  const [editedNotification, setEditedNotification] = useState(notification || {});

  useEffect(() => {
    if (notification) {
      const { scheduledDateTime, ...rest } = notification;
      let scheduledDate = '';
      let scheduledTime = '';
      if (scheduledDateTime) {
        const dateTime = new Date(scheduledDateTime);
        scheduledDate = dateTime.toISOString().split('T')[0];
        scheduledTime = dateTime.toTimeString().split(' ')[0].slice(0, 5);
      }
      setEditedNotification({ ...rest, scheduledDate, scheduledTime });
    }
  }, [notification]);

  const handleChange = (key, value) => {
    setEditedNotification(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const { scheduledDate, scheduledTime, ...rest } = editedNotification;
    const scheduledDateTime = scheduledDate && scheduledTime
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      : null;
    onSave({ ...rest, scheduledDateTime });
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
          <h2 className="text-2xl font-bold text-black dark:text-white">Edit Notification</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            label="Title"
            value={editedNotification.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Message"
            value={editedNotification.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            className="mb-4"
          />
          <Select
            label="Type"
            selectedKeys={editedNotification.type ? [editedNotification.type] : []}
            onChange={(e) => handleChange('type', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="General" value="General" className="text-black dark:text-white">General</SelectItem>
            <SelectItem key="Event" value="Event" className="text-black dark:text-white">Event</SelectItem>
            <SelectItem key="Update" value="Update" className="text-black dark:text-white">Update</SelectItem>
          </Select>
          <Select
            label="Status"
            selectedKeys={editedNotification.status ? [editedNotification.status] : []}
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
              value={editedNotification.scheduledDate || ''}
              onChange={(e) => handleChange('scheduledDate', e.target.value)}
              className="flex-1"
            />
            <Input
              label="Scheduled Time"
              type="time"
              value={editedNotification.scheduledTime || ''}
              onChange={(e) => handleChange('scheduledTime', e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="mb-4">
            <p className="mb-2 text-black dark:text-white">Recipients:</p>
            {recipientOptions.map((option) => (
              <Checkbox
                key={option.value}
                isSelected={editedNotification.recipients?.includes(option.value)}
                onValueChange={(isSelected) => {
                  const updatedRecipients = isSelected
                    ? [...(editedNotification.recipients || []), option.value]
                    : (editedNotification.recipients || []).filter((r) => r !== option.value);
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
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditNotificationModal;