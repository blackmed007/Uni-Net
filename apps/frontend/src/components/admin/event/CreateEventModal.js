import React, { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Textarea,
  Spinner
} from "@nextui-org/react";
import { Calendar, Clock, MapPin, Users, User, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const CreateEventModal = ({ isOpen, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    event_type: '',
    event_status: 'Upcoming',
    organizer: '',
    max_participants: '',
    agenda: [],
    speaker: [],
    event_image: null
  });

  const [eventImagePreview, setEventImagePreview] = useState(null);

  const validateFileUpload = (file) => {
    if (!file) return null;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Image size should be less than 5MB';
    }

    return null;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const errorMessage = validateFileUpload(file);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result);
        setNewEvent(prev => ({ ...prev, event_image: file }));
      };
      reader.readAsDataURL(file);

      // Clear any existing error
      setErrors(prev => ({ ...prev, event_image: undefined }));

    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newEvent.name?.trim()) errors.name = 'Event name is required';
    if (!newEvent.description?.trim()) errors.description = 'Description is required';
    if (!newEvent.date) errors.date = 'Date is required';
    if (!newEvent.time) errors.time = 'Time is required';
    if (!newEvent.location?.trim()) errors.location = 'Location is required';
    if (!newEvent.event_type) errors.event_type = 'Event type is required';
    if (!newEvent.organizer?.trim()) errors.organizer = 'Organizer is required';
    if (!newEvent.max_participants) errors.max_participants = 'Maximum participants is required';
    if (!newEvent.event_image) errors.event_image = 'Event image is required';
    
    // Validate max participants is a positive number
    const maxParticipants = parseInt(newEvent.max_participants);
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      errors.max_participants = 'Maximum participants must be a positive number';
    }

    // Validate agenda items
    if (newEvent.agenda.some(item => !item.trim())) {
      errors.agenda = 'All agenda items must have content';
    }

    // Validate speakers have required fields
    if (newEvent.speaker.some(speaker => !speaker.name?.trim() || !speaker.role?.trim())) {
      errors.speaker = 'All speakers must have a name and role';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (key, value) => {
    setNewEvent(prev => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        toast.error('Please fill in all required fields correctly');
        return;
      }

      setIsSubmitting(true);

      const formattedEvent = {
        ...newEvent,
        agenda: newEvent.agenda.filter(item => item.trim()),
        speaker: newEvent.speaker.filter(s => s.name && s.role),
        max_participants: parseInt(newEvent.max_participants)
      };

      await onSave(formattedEvent);
      handleClose();
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewEvent({
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      event_type: '',
      event_status: 'Upcoming',
      organizer: '',
      max_participants: '',
      agenda: [],
      speaker: [],
      event_image: null
    });
    setEventImagePreview(null);
    setErrors({});
  };

  const addAgendaItem = () => {
    setNewEvent(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const updateAgendaItem = (index, value) => {
    setNewEvent(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAgendaItem = (index) => {
    setNewEvent(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const addSpeaker = () => {
    setNewEvent(prev => ({
      ...prev,
      speaker: [...prev.speaker, { name: '', role: '', image_url: '' }]
    }));
  };

  const updateSpeaker = (index, key, value) => {
    setNewEvent(prev => ({
      ...prev,
      speaker: prev.speaker.map((speaker, i) => 
        i === index ? { ...speaker, [key]: value } : speaker
      )
    }));
  };

  const removeSpeaker = (index) => {
    setNewEvent(prev => ({
      ...prev,
      speaker: prev.speaker.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
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
            Create New Event
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
              label="Event Name"
              placeholder="Enter event name"
              value={newEvent.name}
              onChange={(e) => handleChange('name', e.target.value)}
              startContent={<Calendar className="text-default-400" size={16} />}
              isRequired
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />

            <div className="flex gap-4">
              <Input
                label="Date"
                type="date"
                value={newEvent.date}
                onChange={(e) => handleChange('date', e.target.value)}
                startContent={<Calendar className="text-default-400" size={16} />}
                isRequired
                isInvalid={!!errors.date}
                errorMessage={errors.date}
                className="flex-1"
              />
              <Input
                label="Time"
                type="time"
                value={newEvent.time}
                onChange={(e) => handleChange('time', e.target.value)}
                startContent={<Clock className="text-default-400" size={16} />}
                isRequired
                isInvalid={!!errors.time}
                errorMessage={errors.time}
                className="flex-1"
              />
            </div>

            <Input
              label="Location"
              placeholder="Enter event location"
              value={newEvent.location}
              onChange={(e) => handleChange('location', e.target.value)}
              startContent={<MapPin className="text-default-400" size={16} />}
              isRequired
              isInvalid={!!errors.location}
              errorMessage={errors.location}
            />

            <div className="flex gap-4">
              <Select
                label="Event Type"
                placeholder="Select event type"
                value={newEvent.event_type}
                onChange={(e) => handleChange('event_type', e.target.value)}
                isRequired
                isInvalid={!!errors.event_type}
                errorMessage={errors.event_type}
                className="flex-1"
              >
                <SelectItem key="Workshop" value="Workshop">Workshop</SelectItem>
                <SelectItem key="Seminar" value="Seminar">Seminar</SelectItem>
                <SelectItem key="Conference" value="Conference">Conference</SelectItem>
                <SelectItem key="Social" value="Social">Social</SelectItem>
              </Select>

              <Select
                label="Status"
                placeholder="Select status"
                value={newEvent.event_status}
                onChange={(e) => handleChange('event_status', e.target.value)}
                className="flex-1"
              >
                <SelectItem key="Upcoming" value="Upcoming">Upcoming</SelectItem>
                <SelectItem key="Ongoing" value="Ongoing">Ongoing</SelectItem>
                <SelectItem key="Completed" value="Completed">Completed</SelectItem>
                <SelectItem key="Cancelled" value="Cancelled">Cancelled</SelectItem>
              </Select>
            </div>

            <div className="flex gap-4">
              <Input
                label="Organizer"
                placeholder="Enter organizer name"
                value={newEvent.organizer}
                onChange={(e) => handleChange('organizer', e.target.value)}
                startContent={<User className="text-default-400" size={16} />}
                isRequired
                isInvalid={!!errors.organizer}
                errorMessage={errors.organizer}
                className="flex-1"
              />

              <Input
                label="Max Participants"
                type="number"
                placeholder="Enter maximum participants"
                value={newEvent.max_participants}
                onChange={(e) => handleChange('max_participants', e.target.value)}
                startContent={<Users className="text-default-400" size={16} />}
                isRequired
                isInvalid={!!errors.max_participants}
                errorMessage={errors.max_participants}
                className="flex-1"
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Enter event description"
              value={newEvent.description}
              onChange={(e) => handleChange('description', e.target.value)}
              isRequired
              isInvalid={!!errors.description}
              errorMessage={errors.description}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-small font-bold">Agenda</p>
                <Button size="sm" onClick={addAgendaItem}>Add Agenda Item</Button>
              </div>
              {newEvent.agenda.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateAgendaItem(index, e.target.value)}
                    placeholder="Enter agenda item"
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    color="danger" 
                    variant="flat"
                    onClick={() => removeAgendaItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.agenda && (
                <p className="text-danger text-xs">{errors.agenda}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-small font-bold">Speakers</p>
                <Button size="sm" onClick={addSpeaker}>Add Speaker</Button>
              </div>
              {newEvent.speaker.map((speaker, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={speaker.name}
                    onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                    placeholder="Speaker name"
                    className="flex-1"
                  />
                  <Input
                    value={speaker.role}
                    onChange={(e) => updateSpeaker(index, 'role', e.target.value)}
                    placeholder="Speaker role"
                    className="flex-1"
                  />
                  <Input
                    value={speaker.image_url}
                    onChange={(e) => updateSpeaker(index, 'image_url', e.target.value)}
                    placeholder="Speaker image URL"
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    color="danger" 
                    variant="flat"
                    onClick={() => removeSpeaker(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.speaker && (
                <p className="text-danger text-xs">{errors.speaker}</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-small font-bold mb-2">Event Image</p>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="event-image"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={isSubmitting || isUploading}
                />
                <label
                  htmlFor="event-image"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-400 hover:border-gray-200 transition-colors"
                >
                  <Upload size={20} />
                  <span>{isUploading ? 'Uploading...' : 'Choose event image'}</span>
                </label>
                {eventImagePreview && (
                  <div className="relative w-32 h-32">
                    <img
                      src={eventImagePreview}
                      alt="Event preview"
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setNewEvent(prev => ({ ...prev, event_image: null }));
                        setEventImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </div>
              {errors.event_image && (
                <p className="text-danger text-xs">{errors.event_image}</p>
              )}
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={handleClose}
            isDisabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            color="primary"
            onPress={handleSubmit}
            isDisabled={isSubmitting || isUploading}
            startContent={isSubmitting ? <Spinner size="sm" /> : null}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventModal;