import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Calendar, Clock, MapPin, Users, User } from "lucide-react";

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
  const [editedEvent, setEditedEvent] = useState(event || {});

  useEffect(() => {
    setEditedEvent(event || {});
  }, [event]);

  const handleChange = (key, value) => {
    setEditedEvent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedEvent);
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
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Edit Event</ModalHeader>
        <ModalBody>
          <Input
            label="Event Name"
            value={editedEvent.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            startContent={<Calendar className="text-default-400" size={16} />}
          />
          <div className="flex gap-2">
            <Input
              label="Date"
              type="date"
              value={editedEvent.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              startContent={<Calendar className="text-default-400" size={16} />}
            />
            <Input
              label="Time"
              type="time"
              value={editedEvent.time || ''}
              onChange={(e) => handleChange('time', e.target.value)}
              startContent={<Clock className="text-default-400" size={16} />}
            />
          </div>
          <Input
            label="Location"
            value={editedEvent.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            startContent={<MapPin className="text-default-400" size={16} />}
          />
          <Select
            label="Event Type"
            selectedKeys={editedEvent.type ? [editedEvent.type] : []}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {['Workshop', 'Seminar', 'Conference', 'Webinar'].map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </Select>
          <Select
            label="Status"
            selectedKeys={editedEvent.status ? [editedEvent.status] : []}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {['Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </Select>
          <Input
            label="Organizer"
            value={editedEvent.organizer || ''}
            onChange={(e) => handleChange('organizer', e.target.value)}
            startContent={<User className="text-default-400" size={16} />}
          />
          <Input
            label="Max Participants"
            type="number"
            value={editedEvent.maxParticipants || ''}
            onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
            startContent={<Users className="text-default-400" size={16} />}
          />
          <Textarea
            label="Description"
            value={editedEvent.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <div>
            <p className="text-small font-bold">Agenda</p>
            {(editedEvent.agenda || []).map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => updateAgendaItem(index, e.target.value)}
                className="mt-2"
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
                />
                <Input
                  value={speaker.role}
                  onChange={(e) => updateSpeaker(index, 'role', e.target.value)}
                  placeholder="Role"
                />
                <Input
                  value={speaker.image}
                  onChange={(e) => updateSpeaker(index, 'image', e.target.value)}
                  placeholder="Image URL"
                />
              </div>
            ))}
            <Button size="sm" onPress={addSpeaker} className="mt-2">Add Speaker</Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditEventModal;