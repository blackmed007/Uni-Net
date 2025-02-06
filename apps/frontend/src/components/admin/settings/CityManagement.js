import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Plus, Edit, Trash } from "lucide-react";
import LocationAPI from '../../../services/location.api';

const CityManagement = ({ cities, onCityUpdate }) => {
  const [newCity, setNewCity] = useState('');
  const [editingCity, setEditingCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCity = async () => {
    if (newCity.trim()) {
      try {
        const createdCity = await LocationAPI.addCity({ name: newCity.trim() });
        onCityUpdate([...cities, createdCity]);
        setNewCity('');
      } catch (error) {
        console.error('Error adding city:', error);
      }
    }
  };

  const handleEditCity = (city) => {
    setEditingCity(city);
    setIsModalOpen(true);
  };

  const handleUpdateCity = async () => {
    try {
      const updatedCity = await LocationAPI.updateCity(editingCity.id, editingCity);
      const updatedCities = cities.map((c) =>
        c.id === updatedCity.id ? updatedCity : c
      );
      onCityUpdate(updatedCities);
      setIsModalOpen(false);
      setEditingCity(null);
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      await LocationAPI.deleteCity(id);
      const updatedCities = cities.filter((c) => c.id !== id);
      onCityUpdate(updatedCities);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
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
          <TableColumn className="pr-60">CITY NAME</TableColumn> {/* Added right padding */}
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
