import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar, useToast } from "@nextui-org/react";
import { User, Mail, Upload } from "lucide-react";
import ProfileAPI from '../../../services/profile.api';

const AdminProfileSettings = () => {
  const [settings, setSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch current profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profileData = await ProfileAPI.getCurrentProfile();
      setUserId(profileData.id);
      setSettings({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.email || '',
        profileImage: profileData.profile_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Handle error appropriately
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setIsLoading(true);
    try {
      const profileData = {
        first_name: settings.firstName,
        last_name: settings.lastName,
        email: settings.email,
      };

      await ProfileAPI.updateFullProfile(userId, profileData, selectedFile);
      
      // Refresh profile data after update
      await fetchProfileData();
      
      // Clear selected file after successful upload
      setSelectedFile(null);
      
      // Show success message
      // Note: Implement your preferred notification system here
      console.log('Profile updated successfully');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
      // Note: Implement your preferred notification system here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Admin Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar
            src={settings.profileImage || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
            className="w-24 h-24"
          />
       <Button
  color="primary"
  variant="flat"
  onPress={() => document.getElementById('profile-image-upload').click()}
  startContent={<Upload size={20} />}
  isDisabled={isLoading}
  className="bg-gray-800 text-gray-200 hover:bg-gray-700"  // Dark gray background with light gray text
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
        <div className="flex space-x-4">
          <Input
            label="First Name"
            value={settings.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            startContent={<User className="text-default-400" size={16} />}
            className="flex-1"
            isDisabled={isLoading}
          />
          <Input
            label="Last Name"
            value={settings.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            startContent={<User className="text-default-400" size={16} />}
            className="flex-1"
            isDisabled={isLoading}
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={settings.email}
          onChange={(e) => handleChange('email', e.target.value)}
          startContent={<Mail className="text-default-400" size={16} />}
          isDisabled={isLoading}
        />
        <Button 
          type="submit" 
          color="primary"
          isLoading={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Profile Settings'}
        </Button>
      </form>
    </div>
  );
};

export default AdminProfileSettings;