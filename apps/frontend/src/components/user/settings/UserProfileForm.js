import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar, Select, SelectItem } from "@nextui-org/react";
import { User, Mail, Building, MapPin, Upload } from "lucide-react";
import { motion } from "framer-motion";

const UserProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    city: '',
    profileImage: ''
  });
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      university: user.university || '',
      city: user.city || '',
      profileImage: user.profileImage || ''
    });

    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    setUniversities(storedUniversities);
    setCities(storedCities);
  }, [user]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    onSave(updatedUser);
    
    // Update local storage
    localStorage.setItem('userData', JSON.stringify(updatedUser));

    // Update users in local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ boxShadow: "0 0 25px 5px rgba(168, 85, 247, 0.4)" }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            src={formData.profileImage || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
            className="w-24 h-24 ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-950"
          />
        </motion.div>
        <motion.div
          whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <Button
            color="secondary"
            variant="ghost"
            onPress={() => document.getElementById('profile-image-upload').click()}
            startContent={<Upload size={20} />}
            className="transition-all duration-300 bg-gradient-to-r from-purple-400 to-pink-600 text-white"
          >
            Upload Image
          </Button>
        </motion.div>
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          startContent={<User className="text-purple-400" size={16} />}
          classNames={{
            input: "bg-gray-900 text-white",
            label: "text-gray-300",
          }}
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          startContent={<User className="text-purple-400" size={16} />}
          classNames={{
            input: "bg-gray-900 text-white",
            label: "text-gray-300",
          }}
        />
      </div>
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        startContent={<Mail className="text-purple-400" size={16} />}
        classNames={{
          input: "bg-gray-900 text-white",
          label: "text-gray-300",
        }}
      />
      
      <Select
        label="University"
        placeholder="Select your university"
        value={formData.university}
        onChange={(e) => handleChange('university', e.target.value)}
        startContent={<Building className="text-purple-400" size={16} />}
        classNames={{
          trigger: "bg-gray-900 text-white",
          label: "text-gray-300",
        }}
      >
        {universities.map((university) => (
          <SelectItem key={university.id} value={university.name}>
            {university.name}
          </SelectItem>
        ))}
      </Select>
      
      <Select
        label="City"
        placeholder="Select your city"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        startContent={<MapPin className="text-purple-400" size={16} />}
        classNames={{
          trigger: "bg-gray-900 text-white",
          label: "text-gray-300",
        }}
      >
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </Select>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="submit"
          color="primary"
          className="w-full bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:opacity-80 transition-all duration-300"
        >
          Save Profile
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default UserProfileForm;