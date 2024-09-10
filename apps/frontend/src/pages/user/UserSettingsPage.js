import React, { useState, useEffect } from 'react';
import { NextUIProvider, Tabs, Tab } from "@nextui-org/react";
import UserProfileForm from '../../components/user/settings/UserProfileForm';
import ContactAdminForm from '../../components/user/settings/ContactAdminForm';

const UserSettingsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div>
        <h1 className="text-4xl font-bold mb-6">Settings</h1>
        <Tabs aria-label="User Settings">
          <Tab key="profile" title="Profile Settings">
            <UserProfileForm user={user} onSave={(updatedUser) => setUser(updatedUser)} />
          </Tab>
          <Tab key="contact" title="Contact Admin">
            <ContactAdminForm user={user} />
          </Tab>
        </Tabs>
      </div>
    </NextUIProvider>
  );
};

export default UserSettingsPage;