import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Checkbox } from "@nextui-org/react";
import { motion } from "framer-motion";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    if (key === 'status' && value === 'Sent') {
      const now = new Date();
      setEditedNotification(prev => ({
        ...prev,
        [key]: value,
        scheduledDate: now.toISOString().split('T')[0],
        scheduledTime: now.toTimeString().slice(0, 5)
      }));
    } else {
      setEditedNotification(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = () => {
    if (Object.values(editedNotification).some(value => value === '' || (Array.isArray(value) && value.length === 0))) {
      alert('All fields are required');
      return;
    }

    const { scheduledDate, scheduledTime, ...rest } = editedNotification;
    const scheduledDateTime = scheduledDate && scheduledTime
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      : null;
    onSave({ ...rest, scheduledDateTime });
    onClose();
  };

  const recipientOptions = [
    { label: 'All', value: 'all' },
    { label: 'Admins', value: 'admins' },
    { label: 'Users', value: 'users' },
  ];

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
            Edit Notification
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
              label="Title"
              value={editedNotification.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              isRequired
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
              <ReactQuill
                theme="snow"
                value={editedNotification.message || ''}
                onChange={(content) => handleChange('message', content)}
                className="bg-gray-800 text-white rounded-lg"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
              />
            </div>
            <div className="flex gap-4">
              <Select
                label="Type"
                selectedKeys={editedNotification.type ? [editedNotification.type] : []}
                onChange={(e) => handleChange('type', e.target.value)}
                className="flex-1"
                isRequired
              >
                <SelectItem key="General" value="General">General</SelectItem>
                <SelectItem key="Event" value="Event">Event</SelectItem>
                <SelectItem key="Update" value="Update">Update</SelectItem>
              </Select>
              <Select
                label="Status"
                selectedKeys={editedNotification.status ? [editedNotification.status] : []}
                onChange={(e) => handleChange('status', e.target.value)}
                className="flex-1"
                isRequired
              >
                <SelectItem key="Draft" value="Draft">Draft</SelectItem>
                <SelectItem key="Scheduled" value="Scheduled">Scheduled</SelectItem>
                <SelectItem key="Sent" value="Sent">Sent</SelectItem>
              </Select>
            </div>
            {editedNotification.status !== 'Sent' && (
              <div className="flex gap-4">
                <Input
                  label="Scheduled Date"
                  type="date"
                  value={editedNotification.scheduledDate || ''}
                  onChange={(e) => handleChange('scheduledDate', e.target.value)}
                  className="flex-1"
                  isRequired
                />
                <Input
                  label="Scheduled Time"
                  type="time"
                  value={editedNotification.scheduledTime || ''}
                  onChange={(e) => handleChange('scheduledTime', e.target.value)}
                  className="flex-1"
                  isRequired
                />
              </div>
            )}
            <div>
              <p className="mb-2 text-sm font-semibold">Recipients:</p>
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
                  className="text-white"
                >
                  {option.label}
                </Checkbox>
              ))}
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
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditNotificationModal;