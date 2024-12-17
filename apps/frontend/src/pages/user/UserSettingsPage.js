import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Tabs, Tab } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Save } from "lucide-react";
import { useLocation } from 'react-router-dom';
import UserProfileForm from '../../components/user/settings/UserProfileForm';
import ContactAdminForm from '../../components/user/settings/ContactAdminForm';

const UserSettingsPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);

    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'contact') {
      setActiveTab('contact');
    }
  }, [location]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));

    // Update users in local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const tabs = [
    { key: "profile", title: "Profile Settings" },
    { key: "contact", title: "Contact Admin" },
  ];

  if (!user) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen text-white pt-24">
       <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-lg shadow-md mb-8"
  >
    <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
      UniConnect Settings
    </h1>
    <p className="text-gray-200">
      Customize your profile and manage your account preferences
    </p>
  </motion.div>
      <Card className="bg-gray-950 border border-gray-800 shadow-2xl">
        <CardBody>
          <Tabs 
            aria-label="Settings tabs" 
            color="secondary" 
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            className="mb-6"
          >
            {tabs.map((tab) => (
              <Tab key={tab.key} title={tab.title} />
            ))}
          </Tabs>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "profile" && (
                <UserProfileForm user={user} onSave={handleProfileUpdate} />
              )}
              {activeTab === "contact" && (
                <ContactAdminForm user={user} />
              )}
            </motion.div>
          </AnimatePresence>
        </CardBody>
      </Card>

      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button
          color="primary"
          variant="shadow"
          startContent={<Save size={18} />}
          className="bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:opacity-80 transition-all duration-300"
        >
          Save All Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default UserSettingsPage;