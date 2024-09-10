import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@nextui-org/react";

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

  const selectClasses = {
    label: "text-black dark:text-white",
    trigger: "bg-transparent data-[hover=true]:bg-transparent",
    listbox: "bg-white dark:bg-gray-800",
    innerWrapper: "bg-transparent",
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      classNames={{
        base: "bg-background text-foreground",
        header: "border-b border-default-200",
        body: "py-6",
        footer: "border-t border-default-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Filter Users</ModalHeader>
        <ModalBody>
          <Select
            label="Role"
            placeholder="Select role"
            selectedKeys={filters.role ? [filters.role] : []}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="mb-4"
            classNames={selectClasses}
          >
            <SelectItem key="Student" value="Student">Student</SelectItem>
            <SelectItem key="Teacher" value="Teacher">Teacher</SelectItem>
            <SelectItem key="Admin" value="Admin">Admin</SelectItem>
          </Select>
          <Select
            label="University"
            placeholder="Select university"
            selectedKeys={filters.university ? [filters.university] : []}
            onChange={(e) => handleFilterChange('university', e.target.value)}
            className="mb-4"
            classNames={selectClasses}
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
            className="mb-4"
            classNames={selectClasses}
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
            className="mb-4"
            classNames={selectClasses}
          >
            <SelectItem key="Male" value="Male">Male</SelectItem>
            <SelectItem key="Female" value="Female">Female</SelectItem>
            <SelectItem key="Other" value="Other">Other</SelectItem>
          </Select>
          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={filters.status ? [filters.status] : []}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="mb-4"
            classNames={selectClasses}
          >
            <SelectItem key="Active" value="Active">Active</SelectItem>
            <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleApplyFilters}>
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserFilterModal;