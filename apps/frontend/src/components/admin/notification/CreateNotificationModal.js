import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Checkbox } from "@nextui-org/react";
import { motion } from "framer-motion";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateNotificationModal = ({ isOpen, onClose, onSave }) => {
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: '',
    status: 'Draft',
    recipients: [],
    scheduledDate: '',
    scheduledTime: '',
  });

  const handleChange = (key, value) => {
    if (key === 'status' && value === 'Sent') {
      const now = new Date();
      setNewNotification(prev => ({
        ...prev,
        [key]: value,
        scheduledDate: now.toISOString().split('T')[0],
        scheduledTime: now.toTimeString().slice(0, 5)
      }));
    } else {
      setNewNotification(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = () => {
    if (Object.values(newNotification).some(value => value === '' || (Array.isArray(value) && value.length === 0))) {
      alert('All fields are required');
      return;
    }
    
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
      type: '',
      status: 'Draft',
      recipients: [],
      scheduledDate: '',
      scheduledTime: '',
    });
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
            Create New Notification
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
              placeholder="Enter notification title"
              value={newNotification.title}
              onChange={(e) => handleChange('title', e.target.value)}
              isRequired
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
              <ReactQuill
                theme="snow"
                value={newNotification.message}
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
                placeholder="Select notification type"
                selectedKeys={newNotification.type ? [newNotification.type] : []}
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
                placeholder="Select notification status"
                selectedKeys={[newNotification.status]}
                onChange={(e) => handleChange('status', e.target.value)}
                className="flex-1"
                isRequired
              >
                <SelectItem key="Draft" value="Draft">Draft</SelectItem>
                <SelectItem key="Scheduled" value="Scheduled">Scheduled</SelectItem>
                <SelectItem key="Sent" value="Sent">Sent</SelectItem>
              </Select>
            </div>
            {newNotification.status !== 'Sent' && (
              <div className="flex gap-4">
                <Input
                  label="Scheduled Date"
                  type="date"
                  value={newNotification.scheduledDate}
                  onChange={(e) => handleChange('scheduledDate', e.target.value)}
                  className="flex-1"
                  isRequired
                />
                <Input
                  label="Scheduled Time"
                  type="time"
                  value={newNotification.scheduledTime}
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
                  isSelected={newNotification.recipients.includes(option.value)}
                  onValueChange={(isSelected) => {
                    const updatedRecipients = isSelected
                      ? [...newNotification.recipients, option.value]
                      : newNotification.recipients.filter((r) => r !== option.value);
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
            Create Notification
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNotificationModal;