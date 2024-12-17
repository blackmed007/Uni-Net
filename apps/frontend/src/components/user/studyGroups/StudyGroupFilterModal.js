import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";

const StudyGroupFilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [subjects, setSubjects] = useState([]);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    setFilters(initialFilters);
    // Fetch subjects and universities from localStorage or API
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    setSubjects(storedSubjects);
    setUniversities(storedUniversities);
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
      subject: '',
      university: '',
      studyYear: '',
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
            Filter Study Groups
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
              label="Subject"
              placeholder="Select subject"
              selectedKeys={filters.subject ? [filters.subject] : []}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
            >
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
              ))}
            </Select>
            <Select
              label="University"
              placeholder="Select university"
              selectedKeys={filters.university ? [filters.university] : []}
              onChange={(e) => handleFilterChange('university', e.target.value)}
            >
              {universities.map(university => (
                <SelectItem key={university.id} value={university.name}>{university.name}</SelectItem>
              ))}
            </Select>
            <Select
              label="Study Year"
              placeholder="Select study year"
              selectedKeys={filters.studyYear ? [filters.studyYear] : []}
              onChange={(e) => handleFilterChange('studyYear', e.target.value)}
            >
              {[1, 2, 3, 4, 5].map(year => (
                <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
              ))}
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

export default StudyGroupFilterModal;