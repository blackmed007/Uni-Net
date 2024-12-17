import React, { useState } from 'react';
import { Input, Switch, Button } from "@nextui-org/react";
import { Lock, Key, Shield, Clock } from "lucide-react";


const AuthSettingsForm = ({ initialSettings, onSave }) => {
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
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Authentication Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input
          label="Minimum Password Length"
          type="number"
          value={settings.minPasswordLength}
          onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value))}
          startContent={<Key className="text-default-400" size={16} />}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm">Require Two-Factor Authentication</span>
          <Switch
            checked={settings.requireTwoFactor}
            onChange={(e) => handleChange('requireTwoFactor', e.target.checked)}
            size="sm"
            color="primary"
            startContent={<Shield className="text-default-400" size={16} />}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Allow Password Reset</span>
          <Switch
            checked={settings.allowPasswordReset}
            onChange={(e) => handleChange('allowPasswordReset', e.target.checked)}
            size="sm"
            color="primary"
            startContent={<Lock className="text-default-400" size={16} />}
          />
        </div>
        <Input
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
          startContent={<Clock className="text-default-400" size={16} />}
        />
        <Button 
          type="submit" 
          color="primary"
        >
          Save Authentication Settings
        </Button>
      </form>
    </div>
  );
};

export default AuthSettingsForm;