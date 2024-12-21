import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import UserNavbar from '../../components/user/UserNavbar';
import UserDashboard from '../../components/user/dashboard/UserDashboard';
import NotificationsList from '../../components/user/dashboard/NotificationsList';
import JoinedStudyGroups from '../../components/user/dashboard/JoinedStudyGroups';
import RegisteredEvents from '../../components/user/dashboard/RegisteredEvents';
import RecentActivity from '../../components/user/dashboard/RecentActivity';
import useDarkMode from '../../hooks/useDarkMode';

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [studyGroups, setStudyGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const storedGroups = JSON.parse(localStorage.getItem('studyGroups') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    
    setUser(userData);
    setStudyGroups(storedGroups);
    setEvents(storedEvents);
    setBlogPosts(storedPosts);
    setBookmarkedPosts(storedBookmarks);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bookmarkedPosts') {
        setBookmarkedPosts(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!user) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div className="flex h-screen bg-black text-white">
        <div className="flex flex-col flex-1 overflow-hidden">
          <UserNavbar 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
            user={user}
          />
          <div className="flex-1 overflow-auto p-6 bg-black mt-16">
            <UserDashboard 
              user={user} 
              studyGroups={studyGroups} 
              events={events}
              blogPosts={blogPosts}
              bookmarkedPosts={bookmarkedPosts}
              NotificationsList={NotificationsList}
              JoinedStudyGroups={JoinedStudyGroups}
              RegisteredEvents={RegisteredEvents}
              RecentActivity={RecentActivity}
            />
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default UserDashboardPage;