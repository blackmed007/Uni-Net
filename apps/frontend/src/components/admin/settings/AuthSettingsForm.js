import React, { useState } from 'react';
import { Input, Switch, Button } from "@nextui-org/react";
import { Lock, Key, Shield, Clock } from "lucide-react";

const AuthSettingsForm = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings);

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
          value={8}
          isDisabled={true}
          startContent={<Key className="text-default-400" size={16} />}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm">Require Two-Factor Authentication</span>
          <Switch
            isSelected={false}
            isDisabled={true}
            size="sm"
            color="primary"
            startContent={<Shield className="text-default-400" size={16} />}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Allow Password Reset</span>
          <Switch
            isSelected={false}
            isDisabled={true}
            size="sm"
            color="primary"
            startContent={<Lock className="text-default-400" size={16} />}
          />
        </div>
        <Input
          label="Session Timeout (minutes)"
          type="number"
          value={30}
          isDisabled={true}
          startContent={<Clock className="text-default-400" size={16} />}
        />
        <div className="mt-2 p-2 bg-gray-800 rounded-lg">
          <p className="text-sm text-yellow-400">Limited feature, coming soon. Authentication settings are currently fixed:</p>
          <ul className="text-sm text-gray-300 mt-1 ml-4 list-disc">
            <li>Minimum password length: 8 characters</li>
            <li>Session timeout: 30 minutes</li>
            <li>Two-factor authentication and password reset are currently disabled</li>
          </ul>
        </div>
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