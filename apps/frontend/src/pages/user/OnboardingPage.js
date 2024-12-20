import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, SelectItem } from "@nextui-org/react";import { motion } from "framer-motion";
import { Upload, X } from 'lucide-react';

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    university: '',
    city: '',
    gender: '',
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load universities and cities from localStorage
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    setUniversities(storedUniversities);
    setCities(storedCities);
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.university || !formData.city || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }

    // Update user data in localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedUserData = {
      ...userData,
      ...formData,
      onboardingCompleted: true
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // Navigate to dashboard
    navigate('/user/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4"
         style={{
           backgroundImage: 'url(/assets/login-signup/background.avif)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="University"
            placeholder="Select your university"
            value={formData.university}
            onChange={(e) => handleChange('university', e.target.value)}
            className="w-full"
            classNames={{
              label: "text-white",
              trigger: "bg-transparent border-white/20",
              listbox: "bg-black/60 backdrop-blur-xl",
            }}
          >
            {universities.map((uni) => (
              <SelectItem key={uni.id} value={uni.name}>
                {uni.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="City"
            placeholder="Select your city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full"
            classNames={{
              label: "text-white",
              trigger: "bg-transparent border-white/20",
              listbox: "bg-black/60 backdrop-blur-xl",
            }}
          >
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Gender"
            placeholder="Select your gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full"
            classNames={{
              label: "text-white",
              trigger: "bg-transparent border-white/20",
              listbox: "bg-black/60 backdrop-blur-xl",
            }}
          >
            <SelectItem key="male" value="Male">Male</SelectItem>
            <SelectItem key="female" value="Female">Female</SelectItem>
          </Select>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Profile Picture</label>
            {!imagePreview ? (
              <label className="flex items-center justify-center w-full h-32 px-4 transition bg-black/30 border-2 border-white/10 border-dashed rounded-lg appearance-none cursor-pointer hover:border-white/20 focus:outline-none">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm text-white/60">Click to upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-full h-32">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Complete Profile
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;