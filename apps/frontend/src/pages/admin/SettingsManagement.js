import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Settings, User, Bell, Lock, FileText, AlertTriangle, Building, MapPin } from "lucide-react";
import AdminProfileSettings from '../../components/admin/settings/AdminProfileSettings';
import GeneralSettingsForm from '../../components/admin/settings/GeneralSettingsForm';
import NotificationSettingsForm from '../../components/admin/settings/NotificationSettingsForm';
import AccessLogsTable from '../../components/admin/settings/AccessLogsTable';
import ErrorTrackingDashboard from '../../components/admin/settings/ErrorTrackingDashboard';
import AuthSettingsForm from '../../components/admin/settings/AuthSettingsForm';
import UniversityManagement from '../../components/admin/settings/UniversityManagement';
import CityManagement from '../../components/admin/settings/CityManagement';

const SettingsManagement = ({ adminProfile, onProfileUpdate, settings, onSettingsUpdate }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const storedUniversities = JSON.parse(localStorage.getItem('universities') || '[]');
    const storedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    setUniversities(storedUniversities);
    setCities(storedCities);

    if (storedUniversities.length === 0) {
      const initialUniversities = [
        { id: 1, name: 'Warsaw University of Technology' },
        { id: 2, name: 'Jagiellonian University' },
        { id: 3, name: 'Adam Mickiewicz University' },
        { id: 4, name: 'Wrocław University of Science and Technology' },
        { id: 5, name: 'University of Warsaw' }
      ];
      setUniversities(initialUniversities);
      localStorage.setItem('universities', JSON.stringify(initialUniversities));
    }

    if (storedCities.length === 0) {
      const initialCities = [
        { id: 1, name: 'Poznan' },
        { id: 2, name: 'Warsaw' },
        { id: 3, name: 'Wroclaw' }
      ];
      setCities(initialCities);
      localStorage.setItem('cities', JSON.stringify(initialCities));
    }
  }, []);

  const handleUniversityUpdate = (updatedUniversities) => {
    setUniversities(updatedUniversities);
    localStorage.setItem('universities', JSON.stringify(updatedUniversities));
  };

  const handleCityUpdate = (updatedCities) => {
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const tabs = [
    { key: "profile", label: "Admin Profile", icon: User },
    { key: "general", label: "General", icon: Settings },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "auth", label: "Authentication", icon: Lock },
    { key: "accessLogs", label: "Access Logs", icon: FileText },
    { key: "errorTracking", label: "Error Tracking", icon: AlertTriangle },
    { key: "universities", label: "Universities", icon: Building },
    { key: "cities", label: "Cities", icon: MapPin },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfileSettings initialSettings={adminProfile} onSave={onProfileUpdate} />;
      case "general":
        return <GeneralSettingsForm initialSettings={settings.general} onSave={(newSettings) => onSettingsUpdate('general', newSettings)} />;
      case "notifications":
        return <NotificationSettingsForm initialSettings={settings.notification} onSave={(newSettings) => onSettingsUpdate('notification', newSettings)} />;
      case "auth":
        return <AuthSettingsForm initialSettings={settings.auth} onSave={(newSettings) => onSettingsUpdate('auth', newSettings)} />;
      case "accessLogs":
        return <AccessLogsTable />;
      case "errorTracking":
        return <ErrorTrackingDashboard />;
      case "universities":
        return <UniversityManagement universities={universities} onUniversityUpdate={handleUniversityUpdate} />;
      case "cities":
        return <CityManagement cities={cities} onCityUpdate={handleCityUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-8 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Settings and Configurations</h1>
        <Button 
          color="primary" 
          startContent={<Settings size={18} />}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Save All Changes
        </Button>
      </div>
      <Card className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-2xl">
        <CardBody>
          <div className="flex">
            <div className="w-64 border-r border-gray-800 pr-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    className={`w-full justify-start transition-all duration-200 ${
                      activeTab === tab.key 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    onPress={() => setActiveTab(tab.key)}
                    startContent={<tab.icon size={18} />}
                  >
                    {tab.label}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="flex-1 pl-6">
              {renderContent()}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsManagement;