import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Plus, Edit, Trash } from "lucide-react";

const UniversityManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [newUniversity, setNewUniversity] = useState('');
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    setUniversities(storedUniversities);
  }, []);

  const saveUniversities = (updatedUniversities) => {
    setUniversities(updatedUniversities);
    localStorage.setItem('universities', JSON.stringify(updatedUniversities));
  };

  const handleAddUniversity = () => {
    if (newUniversity.trim()) {
      const updatedUniversities = [...universities, { id: Date.now(), name: newUniversity.trim() }];
      saveUniversities(updatedUniversities);
      setNewUniversity('');
    }
  };

  const handleEditUniversity = (university) => {
    setEditingUniversity(university);
    setIsModalOpen(true);
  };

  const handleUpdateUniversity = () => {
    const updatedUniversities = universities.map(u => 
      u.id === editingUniversity.id ? editingUniversity : u
    );
    saveUniversities(updatedUniversities);
    setIsModalOpen(false);
    setEditingUniversity(null);
  };

  const handleDeleteUniversity = (id) => {
    const updatedUniversities = universities.filter(u => u.id !== id);
    saveUniversities(updatedUniversities);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter university name"
          value={newUniversity}
          onChange={(e) => setNewUniversity(e.target.value)}
        />
        <Button color="primary" onPress={handleAddUniversity} startContent={<Plus size={20} />}>
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
                    <Edit size={20} />
                  </Button>
                  <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDeleteUniversity(university.id)}>
                    <Trash size={20} />
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