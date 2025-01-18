import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

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
      universityId: '',
      cityId: '',
      gender: '',
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
        let displayValue = value;
        
        if (key === 'universityId') {
          const university = universities.find(u => u.id === value);
          displayValue = university ? university.name : value;
        }
        if (key === 'cityId') {
          const city = cities.find(c => c.id === value);
          displayValue = city ? city.name : value;
        }
        
        return (
          <Chip 
            key={key} 
            onClose={() => handleFilterChange(key, '')}
            variant="flat" 
            color="primary"
            className="bg-gradient-to-r from-purple-400 to-pink-600 text-white"
          >
            {`${key.replace('Id', '')}: ${displayValue}`}
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
            <SelectWithReset
              label="Role"
              placeholder="Select role"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              field="role"
              options={[
                <SelectItem key="USER" value="USER">User</SelectItem>,
                <SelectItem key="ADMIN" value="ADMIN">Admin</SelectItem>
              ]}
            />
            
            <SelectWithReset
              label="University"
              placeholder="Select university"
              value={filters.universityId}
              onChange={(e) => handleFilterChange('universityId', e.target.value)}
              field="universityId"
              options={universities.map((university) => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name}
                </SelectItem>
              ))}
            />

            <SelectWithReset
              label="City"
              placeholder="Select city"
              value={filters.cityId}
              onChange={(e) => handleFilterChange('cityId', e.target.value)}
              field="cityId"
              options={cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            />

            <SelectWithReset
              label="Gender"
              placeholder="Select gender"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              field="gender"
              options={[
                <SelectItem key="male" value="male">Male</SelectItem>,
                <SelectItem key="female" value="female">Female</SelectItem>
              ]}
            />

            <SelectWithReset
              label="Status"
              placeholder="Select status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              field="status"
              options={[
                <SelectItem key="Active" value="Active">Active</SelectItem>,
                <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
              ]}
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

export default UserFilterModal;