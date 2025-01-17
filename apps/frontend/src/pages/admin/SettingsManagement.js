import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Settings, User, Bell, Lock, FileText, AlertTriangle, Building, MapPin, ChevronDown } from "lucide-react";
import AdminProfileSettings from '../../components/admin/settings/AdminProfileSettings';
import GeneralSettingsForm from '../../components/admin/settings/GeneralSettingsForm';
import NotificationSettingsForm from '../../components/admin/settings/NotificationSettingsForm';
import AccessLogsTable from '../../components/admin/settings/AccessLogsTable';
import ErrorTrackingDashboard from '../../components/admin/settings/ErrorTrackingDashboard';
import AuthSettingsForm from '../../components/admin/settings/AuthSettingsForm';
import UniversityManagement from '../../components/admin/settings/UniversityManagement';
import CityManagement from '../../components/admin/settings/CityManagement';
import LocationAPI from '../../services/location.api';

const SettingsManagement = ({ adminProfile, onProfileUpdate, settings, onSettingsUpdate }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const universitiesData = await LocationAPI.fetchUniversities();
        const citiesData = await LocationAPI.fetchCities();
        setUniversities(universitiesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleUniversityUpdate = async (updatedUniversities) => {
    setUniversities(updatedUniversities);
  };

  const handleCityUpdate = async (updatedCities) => {
    setCities(updatedCities);
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

  const getCurrentTab = () => {
    return tabs.find(tab => tab.key === activeTab);
  };

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

  // Mobile tab selector dropdown
  const MobileTabSelector = () => {
    const currentTab = getCurrentTab();
    const TabIcon = currentTab.icon;
    
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button 
            className="mb-4 w-full justify-between bg-gray-800 text-white"
            endContent={<ChevronDown size={20} />}
            startContent={<TabIcon size={20} />}
          >
            {currentTab.label}
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Settings tabs" 
          className="w-full"
          onAction={(key) => setActiveTab(key)}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <DropdownItem
                key={tab.key}
                startContent={<Icon size={18} />}
                className={activeTab === tab.key ? 'text-blue-500' : ''}
              >
                {tab.label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  };

  // Desktop sidebar navigation
  const DesktopNavigation = () => (
    <div className="w-64 border-r border-gray-800 pr-4">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              className={`w-full justify-start transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onPress={() => setActiveTab(tab.key)}
              startContent={<Icon size={18} />}
            >
              {tab.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-8 bg-black min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings and Configurations</h1>
        <Button 
          color="primary" 
          startContent={<Settings size={18} />}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Save All Changes
        </Button>
      </div>

      <Card className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-2xl">
        <CardBody>
          {isMobile && <MobileTabSelector />}
          
          <div className={`${isMobile ? 'flex flex-col' : 'flex'}`}>
            {!isMobile && <DesktopNavigation />}
            
            <div className={`${isMobile ? 'w-full' : 'flex-1 pl-6'}`}>
              {renderContent()}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsManagement;