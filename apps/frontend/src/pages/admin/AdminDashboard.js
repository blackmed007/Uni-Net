import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import Sidebar from '../../components/admin/Sidebar';
import CustomNavbar from '../../components/common/CustomNavbar';
import SummaryCard from '../../components/admin/dashboard/SummaryCard';
import ActivityOverview from '../../components/admin/dashboard/ActivityOverview';
import EngagementTrend from '../../components/admin/dashboard/EngagementTrend';
import UserDistribution from '../../components/admin/dashboard/UserDistribution';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import StudyGroupManagement from './StudyGroupManagement';
import BlogManagement from './BlogManagement';
import NotificationManagement from './NotificationManagement';
import SettingsManagement from './SettingsManagement';
import useDarkMode from '../../hooks/useDarkMode';

import { Users, BookOpen, Target, Zap } from "lucide-react";

const mockActivityData = [
    { name: 'Jan', users: 400, events: 240, studyGroups: 240, engagement: 75 },
    { name: 'Feb', users: 300, events: 139, studyGroups: 221, engagement: 68 },
    { name: 'Mar', users: 200, events: 980, studyGroups: 229, engagement: 80 },
    { name: 'Apr', users: 278, events: 390, studyGroups: 200, engagement: 72 },
    { name: 'May', users: 189, events: 480, studyGroups: 218, engagement: 76 },
    { name: 'Jun', users: 239, events: 380, studyGroups: 250, engagement: 82 },
    { name: 'Jul', users: 349, events: 430, studyGroups: 210, engagement: 79 },
];

const defaultSettings = {
  general: {
    websiteState: 'active',
    enableDarkModeByDefault: false,
  },
  notification: {
    enableEmailNotifications: true,
    enablePushNotifications: false,
    defaultNotificationFrequency: 'daily',
  },
  auth: {
    allowSocialLogin: true,
    requireEmailVerification: true,
    passwordResetTokenExpiry: 24,
  },
};

const AdminDashboard = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'dashboard';
  });
  const [adminProfile, setAdminProfile] = useState(() => {
    const savedProfile = localStorage.getItem('adminProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      fullName: 'Admin User',
      email: 'admin@example.com',
      profileImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    };
  });
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
  }, [adminProfile]);

  useEffect(() => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
  }, [settings]);

  const handleProfileUpdate = (newProfile) => {
    setAdminProfile(newProfile);
    // Here you would typically make an API call to update the profile on the backend
    console.log('Profile updated:', newProfile);
  };

  const handleSettingsUpdate = (category, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [category]: newSettings
    }));
    // Here you would typically make an API call to update the settings on the backend
    console.log(`${category} settings updated:`, newSettings);
  };

  return (
    <NextUIProvider>
      <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CustomNavbar 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
            adminProfile={adminProfile}
          />
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h1 className="text-4xl font-bold">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SummaryCard title="Total Users" value="1,234" icon={Users} trend={5.2} color="text-blue-500" />
                  <SummaryCard title="New Signups" value="56" icon={Users} trend={2.1} color="text-green-500" />
                  <SummaryCard title="Active Study Groups" value="42" icon={BookOpen} trend={3.7} color="text-yellow-500" />
                  <SummaryCard title="Engagement Rate" value="78%" icon={Target} trend={1.4} color="text-purple-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ActivityOverview data={mockActivityData} />
                  <EngagementTrend data={mockActivityData} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserDistribution />
                  <RecentActivity />
                </div>
              </div>
            )}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'events' && <EventManagement />}
            {activeTab === 'studygroups' && <StudyGroupManagement />}
            {activeTab === 'blog' && <BlogManagement />}
            {activeTab === 'notifications' && <NotificationManagement />}
            {activeTab === 'settings' && (
              <SettingsManagement 
                adminProfile={adminProfile}
                onProfileUpdate={handleProfileUpdate}
                settings={settings}
                onSettingsUpdate={handleSettingsUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default AdminDashboard;