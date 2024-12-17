import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Chip, Input } from "@nextui-org/react";
import { motion } from "framer-motion";

const NotificationFilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
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
      type: '',
      status: '',
      startDate: '',
      endDate: '',
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
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            Filter Notifications
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Select
              label="Type"
              placeholder="Select notification type"
              selectedKeys={filters.type ? [filters.type] : []}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <SelectItem key="General" value="General">General</SelectItem>
              <SelectItem key="Event" value="Event">Event</SelectItem>
              <SelectItem key="Update" value="Update">Update</SelectItem>
            </Select>
            <Select
              label="Status"
              placeholder="Select notification status"
              selectedKeys={filters.status ? [filters.status] : []}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <SelectItem key="Draft" value="Draft">Draft</SelectItem>
              <SelectItem key="Scheduled" value="Scheduled">Scheduled</SelectItem>
              <SelectItem key="Sent" value="Sent">Sent</SelectItem>
            </Select>
            <div className="flex gap-4">
              <Input
                label="Start Date"
                type="date"
                placeholder="Select start date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                placeholder="Select end date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
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
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
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

export default NotificationFilterModal;