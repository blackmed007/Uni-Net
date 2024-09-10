import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, Avatar } from "@nextui-org/react";

const AdminProfileSettings = ({ initialSettings, onSave, onProfileUpdate }) => {
  const [settings, setSettings] = useState({
    fullName: '',
    email: '',
    profileImage: '',
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
    onProfileUpdate(settings); // Update the navbar
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSettings = { ...settings, profileImage: reader.result };
        setSettings(newSettings);
        onProfileUpdate(newSettings); // Update the navbar immediately when image changes
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar
              src={settings.profileImage || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
              size="lg"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <Input
            label="Full Name"
            value={settings.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Current Information:</h3>
            <p><strong>Full Name:</strong> {initialSettings.fullName}</p>
            <p><strong>Email:</strong> {initialSettings.email}</p>
          </div>
          <Button type="submit" color="primary">
            Save Profile Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default AdminProfileSettings;