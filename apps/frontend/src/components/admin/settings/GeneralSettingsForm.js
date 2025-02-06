import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Switch, Button, Input } from "@nextui-org/react";
import { Globe, Moon } from "lucide-react";

const GeneralSettingsForm = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState({
    websiteState: 'active',
    maintenanceHours: 2,
    maintenanceMinutes: 0,
    ...initialSettings
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'websiteState' && value === 'active') {
      // Reset maintenance time when switching back to active
      localStorage.removeItem('maintenanceEndTime');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (settings.websiteState === 'underMaintenance') {
      // Calculate and store end time for maintenance
      const totalMinutes = (settings.maintenanceHours * 60) + Number(settings.maintenanceMinutes);
      const endTime = new Date(Date.now() + totalMinutes * 60000).getTime();
      localStorage.setItem('maintenanceEndTime', endTime.toString());
    }
    onSave(settings);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">General Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Select
          label="Website State"
          selectedKeys={[settings.websiteState]}
          onChange={(e) => handleChange('websiteState', e.target.value)}
          startContent={<Globe className="text-default-400" size={16} />}
        >
          <SelectItem key="active" value="active">Active</SelectItem>
          <SelectItem key="underMaintenance" value="underMaintenance">Under Maintenance</SelectItem>
        </Select>

        {settings.websiteState === 'underMaintenance' && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-md font-semibold text-gray-200">Maintenance Duration</h3>
            <div className="flex gap-4">
              <Input
                type="number"
                label="Hours"
                min="0"
                max="24"
                value={settings.maintenanceHours}
                onChange={(e) => handleChange('maintenanceHours', Number(e.target.value))}
                className="flex-1"
              />
              <Input
                type="number"
                label="Minutes"
                min="0"
                max="59"
                value={settings.maintenanceMinutes}
                onChange={(e) => handleChange('maintenanceMinutes', Number(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Dark Mode by Default</span>
          <Switch
            isSelected={true}
            isDisabled={true}
            size="sm"
            color="primary"
            startContent={<Moon className="text-default-400" size={16} />}
          />
        </div>
        <Button 
          type="submit" 
          color="primary"
        >
          Save General Settings
        </Button>
      </form>
    </div>
  );
};

export default GeneralSettingsForm;