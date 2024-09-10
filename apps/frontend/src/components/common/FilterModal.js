import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Input } from "@nextui-org/react";

const FilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);

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

  const filterOptions = {
    type: ['General', 'Event', 'Update'],
    status: ['Draft', 'Scheduled', 'Sent'],
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
        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Filter Notifications</ModalHeader>
        <ModalBody>
          <Select
            label="Type"
            placeholder="Select type"
            selectedKeys={filters.type ? [filters.type] : []}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="mb-4"
            classNames={selectClasses}
          >
            {filterOptions.type.map((option) => (
              <SelectItem key={option} value={option} className="text-black dark:text-white">
                {option}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={filters.status ? [filters.status] : []}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="mb-4"
            classNames={selectClasses}
          >
            {filterOptions.status.map((option) => (
              <SelectItem key={option} value={option} className="text-black dark:text-white">
                {option}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="mb-4"
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="mb-4"
          />
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

export default FilterModal;