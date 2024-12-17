import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Calendar, Filter } from "lucide-react";

const EventFilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      classNames={{
        base: "bg-gray-900 text-white",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-2xl font-bold flex items-center">
            <Filter className="mr-2" size={24} />
            Filter Events
          </span>
        </ModalHeader>
        <ModalBody>
          <Select
            label="Event Type"
            placeholder="Select event type"
            selectedKeys={filters.type ? [filters.type] : []}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <SelectItem key="Workshop" value="Workshop">Workshop</SelectItem>
            <SelectItem key="Seminar" value="Seminar">Seminar</SelectItem>
            <SelectItem key="Conference" value="Conference">Conference</SelectItem>
            <SelectItem key="Social" value="Social">Social</SelectItem>
          </Select>
          <Select
            label="Event Status"
            placeholder="Select event status"
            selectedKeys={filters.status ? [filters.status] : []}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <SelectItem key="Upcoming" value="Upcoming">Upcoming</SelectItem>
            <SelectItem key="Ongoing" value="Ongoing">Ongoing</SelectItem>
            <SelectItem key="Completed" value="Completed">Completed</SelectItem>
            <SelectItem key="Cancelled" value="Cancelled">Cancelled</SelectItem>
          </Select>
          <Input
            label="Date"
            type="date"
            placeholder="Select date"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            startContent={<Calendar className="text-default-400" size={16} />}
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

export default EventFilterModal;