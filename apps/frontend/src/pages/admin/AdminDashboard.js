import React, { useState, useEffect } from 'react';
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
import { summaryData } from '../../components/admin/dashboard/DummyData_Dash';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    summaryData: summaryData,
    activityData: [],
    engagementData: [],
    userDistributionData: [],
    recentActivityData: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  if (isLoading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Dashboard Overview</h1>
        <Button
          auto
          disabled
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full px-3 py-1 text-xs opacity-50 cursor-not-allowed"
        >
          Last 7 months
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {dashboardData.summaryData.map((item, index) => (
          <SummaryCard 
            key={index}
            title={item.title} 
            value={item.value} 
            icon={item.icon === 'Users' ? Users : item.icon === 'BookOpen' ? BookOpen : Target} 
            trend={item.trend} 
            color={item.color} 
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-800 p-3">
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Activity Overview</h2>
          </CardHeader>
          <CardBody className="p-3" style={{ height: '250px' }}>
            <ActivityOverview data={dashboardData.activityData} />
          </CardBody>
        </Card>
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-800 p-3">
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">Engagement Trend</h2>
          </CardHeader>
          <CardBody className="p-3" style={{ height: '250px' }}>
            <EngagementTrend data={dashboardData.engagementData} />
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden lg:col-span-2">
          <CardHeader className="border-b border-gray-800 p-3">
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">User Distribution</h2>
          </CardHeader>
          <CardBody className="p-3" style={{ height: '250px' }}>
            <UserDistribution data={dashboardData.userDistributionData} />
          </CardBody>
        </Card>
        <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-800 p-3">
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-600">Recent Activity</h2>
          </CardHeader>
          <CardBody className="p-3 overflow-y-auto" style={{ height: '250px' }}>
            <RecentActivity data={dashboardData.recentActivityData} />
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminProfile, setAdminProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    general: {},
    notification: {},
    auth: {}
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      setAdminProfile(JSON.parse(savedProfile));
    } else {
      setAdminProfile({
        fullName: 'Admin User',
        email: 'admin@example.com',
        profileImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      });
    }
    setIsLoading(false);
  }, []);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab);
  };

  const handleSettingsUpdate = (category, newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: newSettings
    }));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setAdminProfile(updatedProfile);
    // TODO: Remove this localStorage logic when connecting to backend
    localStorage.setItem('adminProfile', JSON.stringify(updatedProfile));
    
  };

  if (isLoading) return <div>Loading admin profile...</div>;
  if (error) return <div>Error: {error}</div>;

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