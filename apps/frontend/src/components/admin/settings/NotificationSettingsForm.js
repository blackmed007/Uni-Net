import React, { useState } from 'react';
import { Switch, Button, Select, SelectItem } from "@nextui-org/react";
import { Bell, Mail } from "lucide-react";

const NotificationSettingsForm = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notification Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Email Notifications</span>
          <Switch
            isSelected={true}
            isDisabled={true}
            size="sm"
            color="primary"
            startContent={<Mail className="text-default-400" size={16} />}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Push Notifications</span>
          <Switch
            isSelected={true}
            isDisabled={true}
            size="sm"
            color="primary"
            startContent={<Bell className="text-default-400" size={16} />}
          />
        </div>
        <Select
          label="Default Notification Frequency"
          selectedKeys={["immediate"]}
          isDisabled={true}
        >
          <SelectItem key="immediate" value="immediate">Immediate</SelectItem>
          <SelectItem key="daily" value="daily">Daily Digest</SelectItem>
          <SelectItem key="weekly" value="weekly">Weekly Digest</SelectItem>
        </Select>
        <div className="mt-2 p-2 bg-gray-800 rounded-lg">
          <p className="text-sm text-yellow-400">Limited feature, coming soon. Notification settings are currently fixed:</p>
          <ul className="text-sm text-gray-300 mt-1 ml-4 list-disc">
            <li>Email notifications enabled</li>
            <li>Push notifications enabled</li>
            <li>Notification frequency set to immediate</li>
          </ul>
        </div>
        <Button 
          type="submit" 
          color="primary"
        >
          Save Notification Settings
        </Button>
      </form>
    </div>
  );
};

export default NotificationSettingsForm;