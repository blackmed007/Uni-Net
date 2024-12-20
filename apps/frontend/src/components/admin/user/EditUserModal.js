import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";

const EditUserModal = ({ isOpen, onClose, user, onSave, universities, cities }) => {
  const [editedUser, setEditedUser] = useState(user || {});

  useEffect(() => {
    if (user) {
      setEditedUser({
        ...user,
        role: user.role || '',
        university: user.university || '',
        city: user.city || '',
        gender: user.gender || '',
        status: user.status || 'Active'
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setEditedUser(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (Object.values(editedUser).some(value => value === '')) {
      alert('All fields are required');
      return;
    }

    const userToSave = {
      ...editedUser,
      id: editedUser.id,
      registrationDate: editedUser.registrationDate || new Date().toISOString(),
    };

    onSave(userToSave);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
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
            Edit User
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                key="firstName-input"
                label="First Name"
                value={editedUser.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
                className="bg-gray-800 text-white"
              />
              <Input
                key="lastName-input"
                label="Last Name"
                value={editedUser.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
                className="bg-gray-800 text-white"
              />
            </div>
            <Input
              key="email-input"
              label="Email"
              value={editedUser.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="bg-gray-800 text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                key="role-select"
                label="Role"
                selectedKeys={editedUser.role ? [editedUser.role] : []}
                onChange={(e) => handleChange('role', e.target.value)}
                required
                className="bg-gray-800 text-white"
              >
                <SelectItem key="Admin">Admin</SelectItem>
                <SelectItem key="Student">Student</SelectItem>
              </Select>
              <Select
                key="gender-select"
                label="Gender"
                selectedKeys={editedUser.gender ? [editedUser.gender] : []}
                onChange={(e) => handleChange('gender', e.target.value)}
                required
                className="bg-gray-800 text-white"
              >
                <SelectItem key="Male">Male</SelectItem>
                <SelectItem key="Female">Female</SelectItem>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                key="university-select"
                label="University"
                selectedKeys={editedUser.university ? [editedUser.university] : []}
                onChange={(e) => handleChange('university', e.target.value)}
                required
                className="bg-gray-800 text-white"
              >
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.name}>
                    {university.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                key="city-select"
                label="City"
                selectedKeys={editedUser.city ? [editedUser.city] : []}
                onChange={(e) => handleChange('city', e.target.value)}
                required
                className="bg-gray-800 text-white"
              >
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Select
              key="status-select"
              label="Status"
              selectedKeys={editedUser.status ? [editedUser.status] : []}
              onChange={(e) => handleChange('status', e.target.value)}
              required
              className="bg-gray-800 text-white"
            >
              <SelectItem key="Active">Active</SelectItem>
              <SelectItem key="Suspended">Suspended</SelectItem>
            </Select>
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

export default EditUserModal;