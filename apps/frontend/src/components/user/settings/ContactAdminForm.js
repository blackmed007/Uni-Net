import React, { useState } from 'react';
import { Input, Textarea, Button, Card, CardBody } from "@nextui-org/react";
import { Send, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

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
    // Here you would typically send the message to the backend
    console.log('Message sent:', formData);
    // Reset form after submission
    setFormData({ subject: '', message: '' });
  };

  return (
    <Card className="bg-gray-950 border border-gray-800 shadow-xl">
      <CardBody>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              color="primary"
              className="w-full bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:opacity-80 transition-all duration-300"
              startContent={<Send size={18} />}
            >
              Send Message
            </Button>
          </motion.div>
        </motion.form>
      </CardBody>
    </Card>
  );
};

export default ContactAdminForm;