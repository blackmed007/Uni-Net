import React, { useState, useEffect } from 'react';
import { Input, Button, Avatar } from "@nextui-org/react";
import { User, Mail, Upload } from "lucide-react";

const AdminProfileSettings = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '',
  });

  useEffect(() => {
    if (initialSettings) {
      // Assuming initialSettings now contains firstName and lastName
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
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
          />
          <Input
            label="Last Name"
            value={settings.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            startContent={<User className="text-default-400" size={16} />}
            className="flex-1"
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={settings.email}
          onChange={(e) => handleChange('email', e.target.value)}
          startContent={<Mail className="text-default-400" size={16} />}
        />
        <Button 
          type="submit" 
          color="primary"
        >
          Save Profile Settings
        </Button>
      </form>
    </div>
  );
};

export default AdminProfileSettings;