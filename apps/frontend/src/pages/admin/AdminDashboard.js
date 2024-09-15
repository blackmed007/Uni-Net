import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { Users, BookOpen, Target } from "lucide-react";
import Sidebar from '../../components/admin/Sidebar';
import CustomNavbar from '../../components/common/CustomNavbar';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import StudyGroupManagement from './StudyGroupManagement';
import BlogManagement from './BlogManagement';
import NotificationManagement from './NotificationManagement';
import SettingsManagement from './SettingsManagement';
import useDarkMode from '../../hooks/useDarkMode';
import SummaryCard from '../../components/admin/dashboard/SummaryCard';
import ActivityOverview from '../../components/admin/dashboard/ActivityOverview';
import EngagementTrend from '../../components/admin/dashboard/EngagementTrend';
import UserDistribution from '../../components/admin/dashboard/UserDistribution';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';

const mockActivityData = [
  { name: 'Jan', users: 400, events: 240, studyGroups: 240, engagement: 75 },
  { name: 'Feb', users: 300, events: 139, studyGroups: 221, engagement: 68 },
  { name: 'Mar', users: 200, events: 980, studyGroups: 229, engagement: 80 },
  { name: 'Apr', users: 278, events: 390, studyGroups: 200, engagement: 72 },
  { name: 'May', users: 189, events: 480, studyGroups: 218, engagement: 76 },
  { name: 'Jun', users: 239, events: 380, studyGroups: 250, engagement: 82 },
  { name: 'Jul', users: 349, events: 430, studyGroups: 210, engagement: 79 },
];

const DashboardOverview = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Dashboard Overview</h1>
        <Button
          auto
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full px-4 py-1 text-sm hover:opacity-80 transition duration-300"
        >
          Last 7 days
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Total Users" value="1,234" icon={Users} trend={5.2} color="blue" onClick={() => console.log('Navigate to Users page')} />
        <SummaryCard title="Active Study Groups" value="42" icon={BookOpen} trend={3.7} color="green" onClick={() => console.log('Navigate to Study Groups page')} />
        <SummaryCard title="Engagement Rate" value="78%" icon={Target} trend={1.4} color="yellow" onClick={() => console.log('Navigate to Engagement page')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Activity Overview</h2>
          </CardHeader>
          <CardBody className="p-4">
            <ActivityOverview data={mockActivityData} />
          </CardBody>
        </Card>
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Engagement Trend</h2>
          </CardHeader>
          <CardBody className="p-4">
            <EngagementTrend data={mockActivityData} />
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden lg:col-span-2">
          <CardHeader className="border-b border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">User Distribution</h2>
          </CardHeader>
          <CardBody className="p-4">
            <UserDistribution />
          </CardBody>
        </Card>
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-600">Recent Activity</h2>
          </CardHeader>
          <CardBody className="p-4 overflow-y-auto max-h-[300px]">
            <RecentActivity />
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminProfile, setAdminProfile] = useState(() => {
    const savedProfile = localStorage.getItem('adminProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      fullName: 'Admin User',
      email: 'admin@example.com',
      profileImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    };
  });
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab);
  };

  const [settings, setSettings] = useState({
    general: {},
    notification: {},
    auth: {}
  });

  const handleSettingsUpdate = (category, newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: newSettings
    }));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setAdminProfile(updatedProfile);
    localStorage.setItem('adminProfile', JSON.stringify(updatedProfile));
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CustomNavbar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          adminProfile={adminProfile}
        />
        <div className="flex-1 overflow-auto p-6 bg-black mt-16">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="studygroups" element={<StudyGroupManagement />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="settings" element={
              <SettingsManagement 
                adminProfile={adminProfile} 
                onProfileUpdate={handleProfileUpdate}
                settings={settings}
                onSettingsUpdate={handleSettingsUpdate}
              />
            } />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;