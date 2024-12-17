import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import UserSidebar from '../../components/user/UserSidebar';
import UserNavbar from '../../components/user/UserNavbar';
import UserDashboard from '../../components/user/dashboard/UserDashboard';
import useDarkMode from '../../hooks/useDarkMode';

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [studyGroups, setStudyGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const storedGroups = JSON.parse(localStorage.getItem('studyGroups') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    setUser(userData);
    setStudyGroups(storedGroups);
    setEvents(storedEvents);
  }, []);

  if (!user) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div className="flex h-screen bg-black text-white">
        <UserSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
            <div className="container mx-auto px-6 py-8">
              <UserDashboard 
                user={user} 
                studyGroups={studyGroups} 
                events={events}
              />
            </div>
          </main>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default UserDashboardPage;