import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Plus, Edit, Trash } from "lucide-react";
import LocationAPI from '../../../services/location.api';

const UniversityManagement = ({ universities, onUniversityUpdate }) => {
  const [newUniversity, setNewUniversity] = useState('');
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUniversity = async () => {
    if (newUniversity.trim()) {
      try {
        const createdUniversity = await LocationAPI.addUniversity({ name: newUniversity.trim() });
        onUniversityUpdate([...universities, createdUniversity]);
        setNewUniversity('');
      } catch (error) {
        console.error('Error adding university:', error);
      }
    }
  };

  const handleEditUniversity = (university) => {
    setEditingUniversity(university);
    setIsModalOpen(true);
  };

  const handleUpdateUniversity = async () => {
    try {
      const updatedUniversity = await LocationAPI.updateUniversity(editingUniversity.id, editingUniversity);
      const updatedUniversities = universities.map((u) =>
        u.id === updatedUniversity.id ? updatedUniversity : u
      );
      onUniversityUpdate(updatedUniversities);
      setIsModalOpen(false);
      setEditingUniversity(null);
    } catch (error) {
      console.error('Error updating university:', error);
    }
  };

  const handleDeleteUniversity = async (id) => {
    try {
      await LocationAPI.deleteUniversity(id);
      const updatedUniversities = universities.filter((u) => u.id !== id);
      onUniversityUpdate(updatedUniversities);
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">University Management</h2>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter university name"
          value={newUniversity}
          onChange={(e) => setNewUniversity(e.target.value)}
          className="flex-grow"
        />
        <Button color="primary" onPress={handleAddUniversity} startContent={<Plus size={16} />}>
          Add University
        </Button>
      </div>
      <Table aria-label="Universities table">
        <TableHeader>
          <TableColumn>UNIVERSITY NAME</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {universities.map((university) => (
            <TableRow key={university.id}>
              <TableCell>{university.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button isIconOnly size="sm" variant="light" onPress={() => handleEditUniversity(university)}>
                    <Edit size={16} />
                  </Button>
                  <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDeleteUniversity(university.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Edit University</ModalHeader>
          <ModalBody>
            <Input
              label="University Name"
              value={editingUniversity?.name || ''}
              onChange={(e) => setEditingUniversity({ ...editingUniversity, name: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateUniversity}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UniversityManagement;