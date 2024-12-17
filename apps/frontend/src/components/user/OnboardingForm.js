import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";

const OnboardingForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    city: '',
    university: '',
    gender: '',
    profilePicture: null
  });
  const [cities, setCities] = useState([]);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    setCities(storedCities);
    setUniversities(storedUniversities);
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.city && formData.university && formData.gender) {
      onComplete(formData);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Select
        label="City"
        placeholder="Select your city"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        required
      >
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="University"
        placeholder="Select your university"
        value={formData.university}
        onChange={(e) => handleChange('university', e.target.value)}
        required
      >
        {universities.map((university) => (
          <SelectItem key={university.id} value={university.name}>
            {university.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Gender"
        placeholder="Select your gender"
        value={formData.gender}
        onChange={(e) => handleChange('gender', e.target.value)}
        required
      >
        <SelectItem key="Male" value="Male">Male</SelectItem>
        <SelectItem key="Female" value="Female">Female</SelectItem>
        <SelectItem key="Other" value="Other">Other</SelectItem>
      </Select>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        label="Profile Picture (optional)"
      />
      <Button type="submit" color="primary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        Complete Profile
      </Button>
    </motion.form>
  );
};

export default OnboardingForm;