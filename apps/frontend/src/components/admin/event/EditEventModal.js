import React, { useState, useEffect } from 'react';
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
import EventsAPI from '../../../services/events.api';

const EditEventModal = ({ isOpen, onClose, onSave, event }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editedEvent, setEditedEvent] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState(null);

  useEffect(() => {
    if (event && isOpen) {
      // Format the event data for editing
      const formattedEvent = {
        ...event,
        date: event.date || new Date(event.datetime).toISOString().split('T')[0],
        time: event.time || new Date(event.datetime).toTimeString().slice(0, 5),
        event_image: null,
        event_image_url: event.event_thumbnail
      };

      setEditedEvent(formattedEvent);
      setEventImagePreview(event.event_thumbnail);
      setErrors({});
    }
  }, [event, isOpen]);

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
        setEditedEvent(prev => ({ ...prev, event_image: file }));
      };
      reader.readAsDataURL(file);

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
    
    if (!editedEvent.name?.trim()) errors.name = 'Event name is required';
    if (!editedEvent.description?.trim()) errors.description = 'Description is required';
    if (!editedEvent.date) errors.date = 'Date is required';
    if (!editedEvent.time) errors.time = 'Time is required';
    if (!editedEvent.location?.trim()) errors.location = 'Location is required';
    if (!editedEvent.event_type) errors.event_type = 'Event type is required';
    if (!editedEvent.organizer?.trim()) errors.organizer = 'Organizer is required';
    if (!editedEvent.max_participants) errors.max_participants = 'Maximum participants is required';

    // Validate max participants
    const maxParticipants = parseInt(editedEvent.max_participants);
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      errors.max_participants = 'Maximum participants must be a positive number';
    }

    // Validate date is not in the past
    if (editedEvent.date) {
      const eventDate = new Date(`${editedEvent.date}T${editedEvent.time || '00:00'}`);
      if (eventDate < new Date()) {
        errors.date = 'Event date cannot be in the past';
      }
    }

    // Validate event type
    if (editedEvent.event_type && !EventsAPI.EVENT_TYPES.includes(editedEvent.event_type)) {
      errors.event_type = `Event type must be one of: ${EventsAPI.EVENT_TYPES.join(', ')}`;
    }

    // Validate event status
    if (editedEvent.event_status && !EventsAPI.EVENT_STATUSES.includes(editedEvent.event_status)) {
      errors.event_status = `Event status must be one of: ${EventsAPI.EVENT_STATUSES.join(', ')}`;
    }

    // Validate agenda items
    if (editedEvent.agenda?.some(item => !item.trim())) {
      errors.agenda = 'All agenda items must have content';
    }

    // Validate speakers
    if (editedEvent.speaker?.some(speaker => !speaker.name?.trim() || !speaker.role?.trim())) {
      errors.speaker = 'All speakers must have a name and role';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (key, value) => {
    setEditedEvent(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!editedEvent) return;

    try {
      if (!validateForm()) {
        toast.error('Please fill in all required fields correctly');
        return;
      }

      setIsSubmitting(true);

      // Prepare the event data
      const formattedEvent = {
        ...editedEvent,
        agenda: editedEvent.agenda?.filter(item => item.trim()),
        speaker: editedEvent.speaker?.filter(s => s.name && s.role),
        max_participants: parseInt(editedEvent.max_participants),
        event_type: editedEvent.event_type,
        event_status: editedEvent.event_status || 'Upcoming'
      };

      await onSave(formattedEvent);
      handleClose();
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditedEvent(null);
    setEventImagePreview(null);
    setErrors({});
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
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAgendaItem = (index) => {
    setEditedEvent(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const addSpeaker = () => {
    setEditedEvent(prev => ({
      ...prev,
      speaker: [...(prev.speaker || []), { name: '', role: '', image_url: '' }]
    }));
  };

  const updateSpeaker = (index, key, value) => {
    setEditedEvent(prev => ({
      ...prev,
      speaker: prev.speaker.map((speaker, i) => 
        i === index ? { ...speaker, [key]: value } : speaker
      )
    }));
  };

  const removeSpeaker = (index) => {
    setEditedEvent(prev => ({
      ...prev,
      speaker: prev.speaker.filter((_, i) => i !== index)
    }));
  };

  if (!editedEvent) return null;

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
              label="Event Name"
              placeholder="Enter event name"
              value={editedEvent.name}
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
                value={editedEvent.date}
                onChange={(e) => handleChange('date', e.target.value)}
                startContent={<Calendar className="text-default-400" size={16} />}
                isRequired
                isInvalid={!!errors.date}
                errorMessage={errors.date}
                className="flex-1"
                min={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Time"
                type="time"
                value={editedEvent.time}
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
              value={editedEvent.location}
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
                selectedKeys={editedEvent.event_type ? [editedEvent.event_type] : []}
                onChange={(e) => handleChange('event_type', e.target.value)}
                isRequired
                isInvalid={!!errors.event_type}
                errorMessage={errors.event_type}
                className="flex-1"
              >
                {EventsAPI.EVENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </Select>

              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={editedEvent.event_status ? [editedEvent.event_status] : []}
                onChange={(e) => handleChange('event_status', e.target.value)}
                className="flex-1"
              >
                {EventsAPI.EVENT_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-4">
              <Input
                label="Organizer"
                placeholder="Enter organizer name"
                value={editedEvent.organizer}
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
                value={editedEvent.max_participants}
                onChange={(e) => handleChange('max_participants', e.target.value)}
                startContent={<Users className="text-default-400" size={16} />}
                isRequired
                isInvalid={!!errors.max_participants}
                errorMessage={errors.max_participants}
                className="flex-1"
                min="1"
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Enter event description"
              value={editedEvent.description}
              onChange={(e) => handleChange('description', e.target.value)}
              isRequired
              isInvalid={!!errors.description}
              errorMessage={errors.description}
              minRows={3}
              maxRows={5}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-small font-bold">Agenda</p>
                <Button size="sm" onClick={addAgendaItem}>Add Agenda Item</Button>
              </div>
              {editedEvent.agenda?.map((item, index) => (
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
                    <X size={16} />
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
              {editedEvent.speaker?.map((speaker, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Input
                    value={speaker.name}
                    onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                    placeholder="Speaker name"
                    size="sm"
                  />
                  <Input
                    value={speaker.role}
                    onChange={(e) => updateSpeaker(index, 'role', e.target.value)}
                    placeholder="Speaker role"
                    size="sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={speaker.image_url}
                      onChange={(e) => updateSpeaker(index, 'image_url', e.target.value)}
                      placeholder="Speaker image URL"
                      size="sm"
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      color="danger" 
                      variant="flat"
                      onClick={() => removeSpeaker(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
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
                        setEditedEvent(prev => ({ ...prev, event_image: null, event_image_url: null }));
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
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditEventModal;