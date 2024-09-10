import React, { useState } from 'react';
import { Input, Switch, Button, Card, CardBody, Select, SelectItem } from "@nextui-org/react";

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
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Website State"
            selectedKeys={[settings.websiteState]}
            onChange={(e) => handleChange('websiteState', e.target.value)}
          >
            <SelectItem key="active" value="active">Active</SelectItem>
            <SelectItem key="underMaintenance" value="underMaintenance">Under Maintenance</SelectItem>
            <SelectItem key="comingSoon" value="comingSoon">Coming Soon</SelectItem>
          </Select>
          <div className="flex items-center justify-between">
            <span>Enable Dark Mode by Default for All Users</span>
            <Switch
              checked={settings.enableDarkModeByDefault}
              onChange={(e) => handleChange('enableDarkModeByDefault', e.target.checked)}
            />
          </div>
          <Button type="submit" color="primary">
            Save General Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default GeneralSettingsForm;