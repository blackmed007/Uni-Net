import React, { useState } from 'react';
import { Input, Switch, Button, Card, CardBody } from "@nextui-org/react";

const AuthSettingsForm = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings || {
    allowSocialLogin: false,
    requireEmailVerification: false,
    passwordResetTokenExpiry: 24,
  });

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
            <span>Allow Social Login</span>
            <Switch
              checked={settings.allowSocialLogin}
              onChange={(e) => handleChange('allowSocialLogin', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Require Email Verification</span>
            <Switch
              checked={settings.requireEmailVerification}
              onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
            />
          </div>
          <Input
            label="Password Reset Token Expiry (hours)"
            type="number"
            value={settings.passwordResetTokenExpiry}
            onChange={(e) => handleChange('passwordResetTokenExpiry', parseInt(e.target.value))}
          />
          <Button type="submit" color="primary">
            Save Auth Settings
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default AuthSettingsForm;