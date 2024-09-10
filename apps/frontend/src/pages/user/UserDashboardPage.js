import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import UserDashboard from '../../components/user/dashboard/UserDashboard';
import NotificationsList from '../../components/user/dashboard/NotificationsList';
import JoinedStudyGroups from '../../components/user/dashboard/JoinedStudyGroups';
import RegisteredEvents from '../../components/user/dashboard/RegisteredEvents';
import RecentActivity from '../../components/user/dashboard/RecentActivity';

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [studyGroups, setStudyGroups] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const storedGroups = JSON.parse(localStorage.getItem('studyGroups') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    setUser(userData);
    setStudyGroups(storedGroups);
    setEvents(storedEvents);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <NextUIProvider>
      <UserDashboard 
        user={user} 
        studyGroups={studyGroups} 
        events={events}
        NotificationsList={NotificationsList}
        JoinedStudyGroups={JoinedStudyGroups}
        RegisteredEvents={RegisteredEvents}
        RecentActivity={RecentActivity}
      />
    </NextUIProvider>
  );
};

export default UserDashboardPage;