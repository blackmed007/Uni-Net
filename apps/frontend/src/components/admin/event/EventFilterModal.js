import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import EventsAPI from '../../../services/events.api';

const EventFilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
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
    });
  };

  const handleResetField = (field) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: ''
    }));
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

  const SelectWithReset = ({ label, placeholder, value, onChange, options, field }) => (
    <div className="relative flex items-center gap-2">
      <Select
        label={label}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        onChange={onChange}
        className="flex-1"
        classNames={{
          trigger: ["bg-transparent", "text-white"],
          label: "text-white",
          popover: "bg-gray-900",
          innerWrapper: "bg-transparent",
        }}
      >
        {options}
      </Select>
      {value && (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => handleResetField(field)}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <RotateCcw size={16} />
        </Button>
      )}
    </div>
  );

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
            Filter Events
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SelectWithReset
              label="Event Type"
              placeholder="Select event type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              field="type"
              options={EventsAPI.EVENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            />

            <SelectWithReset
              label="Event Status"
              placeholder="Select event status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              field="status"
              options={EventsAPI.EVENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            />
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
            className="bg-gradient-to-r from-red-300 to-pink-300 text-white"
          >
            Reset All
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

export default EventFilterModal;