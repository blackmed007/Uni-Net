import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar, Select, SelectItem } from "@nextui-org/react";
import { User, Mail, Building, MapPin, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import ProfileAPI from '../../../services/profile.api';
import LocationAPI from '../../../services/location.api';

const UserProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    city: '',
    profileImage: '',
    universityId: null,
    cityId: null
  });
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch universities and cities
        const universitiesData = await LocationAPI.fetchUniversities();
        const citiesData = await LocationAPI.fetchCities();
        setUniversities(universitiesData);
        setCities(citiesData);

        // If user prop is provided, fetch full user details
        if (user && user.id) {
          const userData = await ProfileAPI.getCurrentProfile();
          
          // Find matching university and city
          const matchedUniversity = universitiesData.find(
            uni => uni.id === userData.universityId || 
                   uni.name === userData.university
          );
          
          const matchedCity = citiesData.find(
            city => city.id === userData.cityId || 
                    city.name === userData.city
          );

          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            university: matchedUniversity ? matchedUniversity.name : '',
            city: matchedCity ? matchedCity.name : '',
            profileImage: userData.profileImage || '',
            universityId: matchedUniversity ? matchedUniversity.id : null,
            cityId: matchedCity ? matchedCity.id : null
          });
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  const handleChange = (key, value) => {
    if (key === 'university') {
      const selectedUniversity = universities.find(uni => uni.name === value);
      setFormData(prev => ({
        ...prev,
        university: value,
        universityId: selectedUniversity ? selectedUniversity.id : null
      }));
    } else if (key === 'city') {
      const selectedCity = cities.find(city => city.name === value);
      setFormData(prev => ({
        ...prev,
        city: value,
        cityId: selectedCity ? selectedCity.id : null
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPEG, PNG, or GIF.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB.');
        return;
      }

      setSelectedFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare update payload
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        universityId: formData.universityId,
        cityId: formData.cityId
      };

      // Update profile with or without image
      const updatedProfile = await ProfileAPI.updateFullProfile(
        user.id, 
        updatePayload, 
        selectedFile
      );
      
      // Call onSave prop with updated user data
      onSave(updatedProfile);
      
      // Clear selected file
      setSelectedFile(null);
      
      // Show success message
      toast.success('Profile updated successfully');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

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
        <Button
          color="secondary"
          variant="bordered"
          onPress={() => document.getElementById('profile-image-upload').click()}
          startContent={<Upload size={20} />}
          className="transition-all duration-300 bg-gradient-to-r from-purple-900 to-purple-700 text-white hover:opacity-90"
        >
          Upload Image
        </Button>
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
        selectedKeys={formData.university ? [formData.university] : []}
        onSelectionChange={(keys) => handleChange('university', Array.from(keys)[0])}
        startContent={<Building className="text-purple-400" size={16} />}
        classNames={{
          trigger: "bg-gray-900 text-white",
          label: "text-gray-300",
        }}
      >
        {universities.map((university) => (
          <SelectItem key={university.name} value={university.name}>
            {university.name}
          </SelectItem>
        ))}
      </Select>
      
      <Select
        label="City"
        placeholder="Select your city"
        selectedKeys={formData.city ? [formData.city] : []}
        onSelectionChange={(keys) => handleChange('city', Array.from(keys)[0])}
        startContent={<MapPin className="text-purple-400" size={16} />}
        classNames={{
          trigger: "bg-gray-900 text-white",
          label: "text-gray-300",
        }}
      >
        {cities.map((city) => (
          <SelectItem key={city.name} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </Select>

      <Button
        type="submit"
        color="primary"
        isLoading={isLoading}
        className="w-full bg-gradient-to-r from-purple-900 to-purple-700 text-white hover:opacity-90"
      >
        Save Profile
      </Button>
    </motion.form>
  );
};

export default UserProfileForm;