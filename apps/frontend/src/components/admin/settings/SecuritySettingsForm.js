import React, { useState } from 'react';
import { Input, Switch, Button, Card, CardBody } from "@nextui-org/react";

const SecuritySettingsForm = ({ initialSettings, onSave }) => {
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
          <Input
            label="Minimum Password Length"
            type="number"
            value={settings.minPasswordLength}
            onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value))}
          />
          <div className="flex items-center justify-between">
            <span>Require Two-Factor Authentication</span>
            <Switch
              checked={settings.requireTwoFactor}
              onChange={(e) => handleChange('requireTwoFactor', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Allow Password Reset</span>
            <Switch
              checked={settings.allowPasswordReset}
              onChange={(e) => handleChange('allowPasswordReset', e.target.checked)}
            />
          </div>
          <Input
            label="Session Timeout (minutes)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
          />
          <Button type="submit" color="primary">
            Save Security Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default SecuritySettingsForm;