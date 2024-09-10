import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import OnboardingForm from '../../components/user/OnboardingForm';
import useDarkMode from '../../hooks/useDarkMode';

const NewUserOnboardingPage = () => {
  const [isDarkMode] = useDarkMode();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser(userData);
      if (userData.profileCompleted) {
        navigate('/user/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleProfileComplete = (profileData) => {
    const updatedUser = { ...user, ...profileData, profileCompleted: true };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    // Update the users list in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    navigate('/user/dashboard');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">Welcome to UniConnect!</h1>
          <p className="text-xl mb-8 text-center text-gray-600 dark:text-gray-300">
            Let's get your profile set up so you can start connecting with your peers.
          </p>
          <OnboardingForm onComplete={handleProfileComplete} />
        </div>
      </div>
    </NextUIProvider>
  );
};

export default NewUserOnboardingPage;