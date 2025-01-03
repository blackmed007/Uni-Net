import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";

const UserFilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters, universities, cities }) => {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      role: '',
      university: '',
      city: '',
      gender: '',
      status: '',
    });
  };

  const renderFilterChips = () => {
    return Object.entries(filters).map(([key, value]) => {
      if (value) {
        return (
          <Chip 
            key={key} 
            onClose={() => handleFilterChange(key, '')}
            variant="flat" 
            color="primary"
            className="bg-gradient-to-r from-purple-400 to-pink-600 text-white"
          >
            {`${key}: ${value}`}
          </Chip>
        );
      }
      return null;
    }).filter(Boolean);
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
            Filter Users
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Select
              label="Role"
              placeholder="Select role"
              selectedKeys={filters.role ? [filters.role] : []}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="max-w-xs"
            >
              <SelectItem key="Admin" value="Admin">Admin</SelectItem>
              <SelectItem key="Student" value="Student">Student</SelectItem>
            </Select>
            <Select
              label="University"
              placeholder="Select university"
              selectedKeys={filters.university ? [filters.university] : []}
              onChange={(e) => handleFilterChange('university', e.target.value)}
              className="max-w-xs"
            >
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.name}>
                  {university.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="City"
              placeholder="Select city"
              selectedKeys={filters.city ? [filters.city] : []}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="max-w-xs"
            >
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Gender"
              placeholder="Select gender"
              selectedKeys={filters.gender ? [filters.gender] : []}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="max-w-xs"
            >
              <SelectItem key="Male" value="Male">Male</SelectItem>
              <SelectItem key="Female" value="Female">Female</SelectItem>
            </Select>
            <Select
              label="Status"
              placeholder="Select status"
              selectedKeys={filters.status ? [filters.status] : []}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="max-w-xs"
            >
              <SelectItem key="Active" value="Active">Active</SelectItem>
              <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
            </Select>
          </motion.div>
          <motion.div 
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {renderFilterChips()}
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={handleResetFilters}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80 transition-opacity"
            style={{
              color: 'white !important',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            Reset
          </Button>
          <Button 
            color="primary" 
            onPress={handleApplyFilters}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserFilterModal;