import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Calendar, Clock, MapPin, Users, User, Image, Upload } from "lucide-react";
import { motion } from "framer-motion";

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
  const [editedEvent, setEditedEvent] = useState(event || {});
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    setEditedEvent(event || {});
    setUploadedImage(null);
  }, [event]);

  const handleChange = (key, value) => {
    setEditedEvent(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (Object.values(editedEvent).some(value => value === '')) {
      alert('All fields are required');
      return;
    }
    onSave({ ...editedEvent, image: uploadedImage || editedEvent.image });
    onClose();
  };

  const addAgendaItem = () => {
    setEditedEvent(prev => ({
      ...prev,
      agenda: [...(prev.agenda || []), '']
    }));
  };

  const updateAgendaItem = (index, value) => {
    setEditedEvent(prev => ({
      ...prev,
      agenda: (prev.agenda || []).map((item, i) => i === index ? value : item)
    }));
  };

  const addSpeaker = () => {
    setEditedEvent(prev => ({
      ...prev,
      speakers: [...(prev.speakers || []), { name: '', role: '', image: '' }]
    }));
  };

  const updateSpeaker = (index, key, value) => {
    setEditedEvent(prev => ({
      ...prev,
      speakers: (prev.speakers || []).map((speaker, i) => 
        i === index ? { ...speaker, [key]: value } : speaker
      )
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            Edit Event
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              label="Event ID"
              value={editedEvent.id || ''}
              isReadOnly
              startContent={<Calendar className="text-default-400" size={16} />}
            />
            <Input
              label="Event Name"
              value={editedEvent.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              startContent={<Calendar className="text-default-400" size={16} />}
              isRequired
            />
            <div className="flex gap-2">
              <Input
                label="Date"
                type="date"
                value={editedEvent.date || ''}
                onChange={(e) => handleChange('date', e.target.value)}
                startContent={<Calendar className="text-default-400" size={16} />}
                isRequired
              />
              <Input
                label="Time"
                type="time"
                value={editedEvent.time || ''}
                onChange={(e) => handleChange('time', e.target.value)}
                startContent={<Clock className="text-default-400" size={16} />}
                isRequired
              />
            </div>
            <Input
              label="Location"
              value={editedEvent.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              startContent={<MapPin className="text-default-400" size={16} />}
              isRequired
            />
            <Select
              label="Event Type"
              selectedKeys={editedEvent.type ? [editedEvent.type] : []}
              onChange={(e) => handleChange('type', e.target.value)}
              isRequired
            >
              <SelectItem key="Workshop" value="Workshop">Workshop</SelectItem>
              <SelectItem key="Seminar" value="Seminar">Seminar</SelectItem>
              <SelectItem key="Conference" value="Conference">Conference</SelectItem>
              <SelectItem key="Social" value="Social">Social</SelectItem>
            </Select>
            <Select
              label="Status"
              selectedKeys={editedEvent.status ? [editedEvent.status] : []}
              onChange={(e) => handleChange('status', e.target.value)}
              isRequired
            >
              <SelectItem key="Upcoming" value="Upcoming">Upcoming</SelectItem>
              <SelectItem key="Ongoing" value="Ongoing">Ongoing</SelectItem>
              <SelectItem key="Completed" value="Completed">Completed</SelectItem>
              <SelectItem key="Cancelled" value="Cancelled">Cancelled</SelectItem>
            </Select>
            <Input
              label="Organizer"
              value={editedEvent.organizer || ''}
              onChange={(e) => handleChange('organizer', e.target.value)}
              startContent={<User className="text-default-400" size={16} />}
              isRequired
            />
            <Input
              label="Max Participants"
              type="number"
              value={editedEvent.maxParticipants || ''}
              onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
              startContent={<Users className="text-default-400" size={16} />}
              isRequired
            />
            <Textarea
              label="Description"
              value={editedEvent.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              isRequired
            />
            <div>
              <p className="text-small font-bold">Agenda</p>
              {(editedEvent.agenda || []).map((item, index) => (
                <Input
                  key={index}
                  value={item}
                  onChange={(e) => updateAgendaItem(index, e.target.value)}
                  className="mt-2"
                  isRequired
                />
              ))}
              <Button size="sm" onPress={addAgendaItem} className="mt-2">Add Agenda Item</Button>
            </div>
            <div>
              <p className="text-small font-bold">Speakers</p>
              {(editedEvent.speakers || []).map((speaker, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={speaker.name}
                    onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                    placeholder="Name"
                    isRequired
                  />
                  <Input
                    value={speaker.role}
                    onChange={(e) => updateSpeaker(index, 'role', e.target.value)}
                    placeholder="Role"
                    isRequired
                  />
                  <Input
                    value={speaker.image}
                    onChange={(e) => updateSpeaker(index, 'image', e.target.value)}
                    placeholder="Image URL"
                    isRequired
                  />
                </div>
              ))}
              <Button size="sm" onPress={addSpeaker} className="mt-2">Add Speaker</Button>
            </div>
            <div>
              <p className="text-small font-bold mb-2">Event Image</p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-xs mb-1">Upload Image</p>
                  <label className="flex items-center justify-center w-full h-[38px] px-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="text-gray-400 mr-2" size={16} />
                    <span className="text-sm text-gray-400">Choose file</span>
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-xs mb-1">Image URL</p>
                  <Input
                    placeholder="Enter image URL"
                    value={editedEvent.image}
                    onChange={(e) => handleChange('image', e.target.value)}
                    startContent={<Image className="text-gray-400" size={16} />}
                    className="h-[38px]"
                  />
                </div>
              </div>
              {(uploadedImage || editedEvent.image) && (
                <img 
                  src={uploadedImage || editedEvent.image} 
                  alt="Event" 
                  className="mt-4 max-w-full h-auto rounded-lg"
                />
              )}
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditEventModal;