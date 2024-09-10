import React, { useState } from 'react';
import { Input, Switch, Button, Card, CardBody } from "@nextui-org/react";

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
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable Email Notifications</span>
            <Switch
              checked={settings.enableEmailNotifications}
              onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Enable Push Notifications</span>
            <Switch
              checked={settings.enablePushNotifications}
              onChange={(e) => handleChange('enablePushNotifications', e.target.checked)}
            />
          </div>
          <Input
            label="Default Notification Frequency"
            type="select"
            value={settings.defaultNotificationFrequency}
            onChange={(e) => handleChange('defaultNotificationFrequency', e.target.value)}
            selectionMode="single"
          >
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Digest</option>
          </Input>
          <Button type="submit" color="primary">
            Save Notification Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default NotificationSettingsForm;