import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";

const CreateUserModal = ({ isOpen, onClose, onSave, universities, cities }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student',
    university: '',
    city: '',
    gender: '',
    status: 'Active',
  });

  const handleChange = (key, value) => {
    setNewUser(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(newUser);
    setNewUser({
      name: '',
      email: '',
      role: 'Student',
      university: '',
      city: '',
      gender: '',
      status: 'Active',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Create New User</ModalHeader>
        <ModalBody>
          <Input
            label="Name"
            value={newUser.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Email"
            value={newUser.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mb-4"
          />
          <Select
            label="Role"
            selectedKeys={[newUser.role]}
            onChange={(e) => handleChange('role', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Student" value="Student">Student</SelectItem>
            <SelectItem key="Teacher" value="Teacher">Teacher</SelectItem>
            <SelectItem key="Admin" value="Admin">Admin</SelectItem>
          </Select>
          <Select
            label="University"
            selectedKeys={newUser.university ? [newUser.university] : []}
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
            selectedKeys={newUser.city ? [newUser.city] : []}
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
            selectedKeys={newUser.gender ? [newUser.gender] : []}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Male" value="Male">Male</SelectItem>
            <SelectItem key="Female" value="Female">Female</SelectItem>
            <SelectItem key="Other" value="Other">Other</SelectItem>
          </Select>
          <Select
            label="Status"
            selectedKeys={[newUser.status]}
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
            Create User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;