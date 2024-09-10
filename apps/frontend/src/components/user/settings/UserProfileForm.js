import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Avatar, Select, SelectItem } from "@nextui-org/react";

const UserProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    university: user.university,
    city: user.city,
    gender: user.gender,
    profileImage: user.profileImage,
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Here you would typically make an API call to update the user profile
    console.log('Updated user profile:', formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profileImage', reader.result);
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
              src={formData.profileImage}
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
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Select
            label="University"
            value={formData.university}
            onChange={(e) => handleChange('university', e.target.value)}
          >
            {/* Add university options here */}
            <SelectItem key="example-university" value="Example University">
              Example University
            </SelectItem>
          </Select>
          <Select
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          >
            {/* Add city options here */}
            <SelectItem key="example-city" value="Example City">
              Example City
            </SelectItem>
          </Select>
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <SelectItem key="male" value="Male">Male</SelectItem>
            <SelectItem key="female" value="Female">Female</SelectItem>
            <SelectItem key="other" value="Other">Other</SelectItem>
          </Select>
          <Button type="submit" color="primary">
            Save Profile Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default UserProfileForm;