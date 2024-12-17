import React, { useState } from 'react';
import { Switch, Button, Select, SelectItem } from "@nextui-org/react";
import { Bell, Mail } from "lucide-react";

const NotificationSettingsForm = ({ initialSettings, onSave }) => {
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
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notification Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Email Notifications</span>
          <Switch
            checked={settings.enableEmailNotifications}
            onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
            size="sm"
            color="primary"
            startContent={<Mail className="text-default-400" size={16} />}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Push Notifications</span>
          <Switch
            checked={settings.enablePushNotifications}
            onChange={(e) => handleChange('enablePushNotifications', e.target.checked)}
            size="sm"
            color="primary"
            startContent={<Bell className="text-default-400" size={16} />}
          />
        </div>
        <Select
          label="Default Notification Frequency"
          selectedKeys={[settings.defaultNotificationFrequency]}
          onChange={(e) => handleChange('defaultNotificationFrequency', e.target.value)}
        >
          <SelectItem key="immediate" value="immediate">Immediate</SelectItem>
          <SelectItem key="daily" value="daily">Daily Digest</SelectItem>
          <SelectItem key="weekly" value="weekly">Weekly Digest</SelectItem>
        </Select>
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