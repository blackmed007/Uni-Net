import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";

const EditUserModal = ({ isOpen, onClose, user, onSave, universities, cities }) => {
  const [editedUser, setEditedUser] = useState(user || {});

  useEffect(() => {
    setEditedUser(user || {});
  }, [user]);

  const handleChange = (key, value) => {
    setEditedUser(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedUser);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalBody>
          <Input
            label="Name"
            value={editedUser.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Email"
            value={editedUser.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mb-4"
          />
          <Select
            label="Role"
            selectedKeys={editedUser.role ? [editedUser.role] : []}
            onChange={(e) => handleChange('role', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Student" value="Student">Student</SelectItem>
            <SelectItem key="Teacher" value="Teacher">Teacher</SelectItem>
            <SelectItem key="Admin" value="Admin">Admin</SelectItem>
          </Select>
          <Select
            label="University"
            selectedKeys={editedUser.university ? [editedUser.university] : []}
            onChange={(e) => handleChange('university', e.target.value)}
            className="mb-4"
          >
            {universities.map((university) => (
              <SelectItem key={university.id} value={university.name}>
                {university.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="City"
            selectedKeys={editedUser.city ? [editedUser.city] : []}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mb-4"
          >
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Gender"
            selectedKeys={editedUser.gender ? [editedUser.gender] : []}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Male" value="Male">Male</SelectItem>
            <SelectItem key="Female" value="Female">Female</SelectItem>
            <SelectItem key="Other" value="Other">Other</SelectItem>
          </Select>
          <Select
            label="Status"
            selectedKeys={editedUser.status ? [editedUser.status] : []}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Active" value="Active">Active</SelectItem>
            <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
          </Select>
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

export default EditUserModal;