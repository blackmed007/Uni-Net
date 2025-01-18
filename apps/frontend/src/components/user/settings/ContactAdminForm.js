import React, { useState } from 'react';
import { Input, Textarea, Button, Card, CardBody } from "@nextui-org/react";
import { Send, HelpCircle } from "lucide-react";

const ContactAdminForm = ({ user }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send message to hamid.263c@gmail.com
    const mailtoLink = `mailto:hamid.263c@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
    window.location.href = mailtoLink;
    
    // Reset form after submission
    setFormData({ subject: '', message: '' });
  };

  return (
    <Card className="bg-gray-950 border border-gray-800 shadow-xl">
      <CardBody>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          <div>
            <Input
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter the subject of your message"
              startContent={<HelpCircle className="text-purple-400" size={16} />}
              classNames={{
                input: "bg-gray-900 text-white",
                label: "text-gray-300",
              }}
            />
          </div>
          
          <div>
            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              minRows={4}
              classNames={{
                input: "bg-gray-900 text-white",
                label: "text-gray-300",
              }}
            />
          </div>
          
          <div>
            <Button 
              type="submit" 
              color="primary"
              className="w-full bg-gradient-to-r from-purple-900 to-purple-700 text-white hover:opacity-90"
              startContent={<Send size={18} />}
            >
              Send Message
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ContactAdminForm;