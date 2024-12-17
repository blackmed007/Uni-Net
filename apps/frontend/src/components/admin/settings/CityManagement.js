import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Plus, Edit, Trash } from "lucide-react";

const CityManagement = ({ cities, onCityUpdate }) => {
  const [newCity, setNewCity] = useState('');
  const [editingCity, setEditingCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCity = () => {
    if (newCity.trim()) {
      const updatedCities = [...cities, { id: Date.now(), name: newCity.trim() }];
      onCityUpdate(updatedCities);
      setNewCity('');
    }
  };

  const handleEditCity = (city) => {
    setEditingCity(city);
    setIsModalOpen(true);
  };

  const handleUpdateCity = () => {
    const updatedCities = cities.map(c => 
      c.id === editingCity.id ? editingCity : c
    );
    onCityUpdate(updatedCities);
    setIsModalOpen(false);
    setEditingCity(null);
  };

  const handleDeleteCity = (id) => {
    const updatedCities = cities.filter(c => c.id !== id);
    onCityUpdate(updatedCities);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">City Management</h2>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter city name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="flex-grow"
        />
        <Button color="primary" onPress={handleAddCity} startContent={<Plus size={16} />}>
          Add City
        </Button>
      </div>
      <Table aria-label="Cities table">
        <TableHeader>
          <TableColumn>CITY NAME</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {cities.map((city) => (
            <TableRow key={city.id}>
              <TableCell>{city.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button isIconOnly size="sm" variant="light" onPress={() => handleEditCity(city)}>
                    <Edit size={16} />
                  </Button>
                  <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDeleteCity(city.id)}>
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
          <ModalHeader>Edit City</ModalHeader>
          <ModalBody>
            <Input
              label="City Name"
              value={editingCity?.name || ''}
              onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateCity}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CityManagement;