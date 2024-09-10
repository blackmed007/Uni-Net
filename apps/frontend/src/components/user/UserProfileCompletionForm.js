import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Select, SelectItem } from "@nextui-org/react";

const UserProfileCompletionForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    university: '',
    city: '',
    gender: '',
  });
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Fetch universities and cities from localStorage or API
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    setUniversities(storedUniversities);
    setCities(storedCities);
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user profile
    console.log('Completed user profile:', formData);
    onComplete(formData);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="University"
            placeholder="Select your university"
            value={formData.university}
            onChange={(e) => handleChange('university', e.target.value)}
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
          >
            <SelectItem key="male" value="Male">Male</SelectItem>
            <SelectItem key="female" value="Female">Female</SelectItem>
            <SelectItem key="other" value="Other">Other</SelectItem>
          </Select>
          <Button type="submit" color="primary">
            Complete Profile
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default UserProfileCompletionForm;