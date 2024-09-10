import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import AdminProfileSettings from '../../components/admin/settings/AdminProfileSettings';
import GeneralSettingsForm from '../../components/admin/settings/GeneralSettingsForm';
import NotificationSettingsForm from '../../components/admin/settings/NotificationSettingsForm';
import AccessLogsTable from '../../components/admin/settings/AccessLogsTable';
import ErrorTrackingDashboard from '../../components/admin/settings/ErrorTrackingDashboard';
import AuthSettingsForm from '../../components/admin/settings/AuthSettingsForm';
import UniversityManagement from '../../components/admin/settings/UniversityManagement';
import CityManagement from '../../components/admin/settings/CityManagement';

const SettingsManagement = ({ adminProfile, onProfileUpdate, settings, onSettingsUpdate }) => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Settings and Configurations</h1>
      <Card>
        <CardBody>
          <Tabs>
            <Tab key="profile" title="Admin Profile">
              <AdminProfileSettings
                initialSettings={adminProfile}
                onSave={onProfileUpdate}
              />
            </Tab>
            <Tab key="general" title="General">
              <GeneralSettingsForm
                initialSettings={settings.general}
                onSave={(newSettings) => onSettingsUpdate('general', newSettings)}
              />
            </Tab>
            <Tab key="notification" title="Notifications">
              <NotificationSettingsForm
                initialSettings={settings.notification}
                onSave={(newSettings) => onSettingsUpdate('notification', newSettings)}
              />
            </Tab>
            <Tab key="auth" title="Authentication">
              <AuthSettingsForm
                initialSettings={settings.auth}
                onSave={(newSettings) => onSettingsUpdate('auth', newSettings)}
              />
            </Tab>
            <Tab key="accessLogs" title="Access Logs">
              <AccessLogsTable />
            </Tab>
            <Tab key="errorTracking" title="Error Tracking">
              <ErrorTrackingDashboard />
            </Tab>
            <Tab key="universityManagement" title="University Management">
              <UniversityManagement
                universities={universities}
                onUniversityUpdate={handleUniversityUpdate}
              />
            </Tab>
            <Tab key="cityManagement" title="City Management">
              <CityManagement
                cities={cities}
                onCityUpdate={handleCityUpdate}
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsManagement;