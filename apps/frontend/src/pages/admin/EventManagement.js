import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import EventListTable from '../../components/admin/event/EventListTable';
import EventDetailModal from '../../components/admin/event/EventDetailModal';
import FilterModal from '../../components/common/FilterModal';
import CreateEventModal from '../../components/admin/event/CreateEventModal';
import EditEventModal from '../../components/admin/event/EditEventModal';
import ConfirmActionModal from '../../components/common/ConfirmActionModal';
import { filterEvents, sortEvents } from '../../utils/eventHelpers';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    date: '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionType, setActionType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isEventDetailOpen, onOpen: onEventDetailOpen, onClose: onEventDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
  }, []);

  const saveEvents = (updatedEvents) => {
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    onFilterClose();
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const handleEventAction = (action, event) => {
    setSelectedEvent(event);
    setActionType(action);
    switch (action) {
      case 'view':
        onEventDetailOpen();
        break;
      case 'edit':
        onEditOpen();
        break;
      case 'cancel':
      case 'delete':
        onConfirmOpen();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmAction = () => {
    if (actionType === 'cancel') {
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? { ...event, status: 'Cancelled' } : event
      );
      saveEvents(updatedEvents);
    } else if (actionType === 'delete') {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      saveEvents(updatedEvents);
    }
    onConfirmClose();
  };

  const handleCreateEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    onCreateClose();
  };

  const handleEditEvent = (updatedEvent) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    saveEvents(updatedEvents);
    onEditClose();
  };

  const filteredEvents = filterEvents(events, searchTerm, filters);
  const sortedEvents = sortEvents(filteredEvents, sortConfig.key, sortConfig.direction);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Event Management</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button color="primary" onPress={onFilterOpen} startContent={<Filter size={20} />}>
          Filters
        </Button>
        <Button color="success" onPress={onCreateOpen} startContent={<Plus size={20} />}>
          Create Event
        </Button>
      </div>
      {events.length === 0 ? (
        <p>No events found. Create a new event to get started.</p>
      ) : (
        <EventListTable
          events={sortedEvents}
          searchTerm={searchTerm}
          filters={filters}
          onEventAction={handleEventAction}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      )}
      <EventDetailModal
        isOpen={isEventDetailOpen}
        onClose={onEventDetailClose}
        event={selectedEvent}
      />
      <FilterModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={handleFilter}
        initialFilters={filters}
      />
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSave={handleCreateEvent}
      />
      <EditEventModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        event={selectedEvent}
        onSave={handleEditEvent}
      />
      <ConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
      />
    </div>
  );
};

export default EventManagement;