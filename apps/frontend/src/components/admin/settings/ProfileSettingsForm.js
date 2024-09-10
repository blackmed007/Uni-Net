import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, Avatar } from "@nextui-org/react";

const ProfileSettingsForm = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState({
    username: '',
    email: '',
    role: '',
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
            label="Username"
            value={settings.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Input
            label="Role"
            value={settings.role}
            readOnly
          />
          <Button type="submit" color="primary">
            Save Profile Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default ProfileSettingsForm;