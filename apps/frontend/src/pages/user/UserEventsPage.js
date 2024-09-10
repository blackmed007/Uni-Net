import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import EventsList from '../../components/user/events/EventsList';

const UserEventsPage = () => {
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
        
        <EventsList userId={user.id} />
      </div>
    </NextUIProvider>
  );
};

export default UserEventsPage;