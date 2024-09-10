import React, { useState } from 'react';
import { Card, CardBody, Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";

const ContactAdminForm = ({ user }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: '',
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to send the message to the admin
    console.log('Message sent to admin:', { ...formData, userId: user.id });
    // Reset form after submission
    setFormData({ subject: '', message: '', category: '' });
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            placeholder="Select a category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <SelectItem key="technical" value="Technical Issue">Technical Issue</SelectItem>
            <SelectItem key="account" value="Account Problem">Account Problem</SelectItem>
            <SelectItem key="feedback" value="Feedback">Feedback</SelectItem>
            <SelectItem key="other" value="Other">Other</SelectItem>
          </Select>
          <Input
            label="Subject"
            placeholder="Enter the subject of your message"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
          />
          <Textarea
            label="Message"
            placeholder="Type your message here..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            minRows={4}
          />
          <Button type="submit" color="primary">
            Send Message
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default ContactAdminForm;