import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar } from "@nextui-org/react";
import { User, Mail, Upload } from "lucide-react";
import { toast } from 'react-hot-toast';
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
      setIsLoading(true);
      const profileData = await ProfileAPI.getCurrentProfile();
      setUserId(profileData.id);
      setSettings({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        profileImage: profileData.profileImage || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
        setSettings(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    // Basic validation
    if (!settings.firstName || !settings.lastName || !settings.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const updatePayload = {
        firstName: settings.firstName,
        lastName: settings.lastName,
        email: settings.email,
      };

      // Update profile with or without image
      const updatedProfile = await ProfileAPI.updateFullProfile(
        userId, 
        updatePayload, 
        selectedFile
      );
      
      // Update local state with returned data
      setSettings({
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        email: updatedProfile.email || '',
        profileImage: updatedProfile.profileImage || '',
      });
      
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
            className="bg-gray-800 text-gray-200 hover:bg-gray-700"
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
            isRequired
          />
          <Input
            label="Last Name"
            value={settings.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            startContent={<User className="text-default-400" size={16} />}
            className="flex-1"
            isDisabled={isLoading}
            isRequired
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={settings.email}
          onChange={(e) => handleChange('email', e.target.value)}
          startContent={<Mail className="text-default-400" size={16} />}
          isDisabled={isLoading}
          isRequired
        />
        <Button 
          type="submit" 
          color="primary"
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Profile Settings'}
        </Button>
      </form>
    </div>
  );
};

export default AdminProfileSettings;