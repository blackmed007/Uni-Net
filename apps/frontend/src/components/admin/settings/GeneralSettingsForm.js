import React, { useState } from 'react';
import { Select, SelectItem, Switch, Button } from "@nextui-org/react";
import { Globe, Moon } from "lucide-react";

const GeneralSettingsForm = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <div className="mt-2 p-2 bg-gray-800 rounded-lg">
          <p className="text-sm text-yellow-400">Limited feature, coming soon. Some settings are currently fixed.</p>
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