import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, useDisclosure, Pagination } from "@nextui-org/react";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import EventListTable from '../../components/admin/event/EventListTable';
import EventDetailModal from '../../components/admin/event/EventDetailModal';
import EventFilterModal from '../../components/admin/event/EventFilterModal';
import CreateEventModal from '../../components/admin/event/CreateEventModal';
import EditEventModal from '../../components/admin/event/EditEventModal';
import EventConfirmActionModal from '../../components/admin/event/EventConfirmActionModal';

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of events per page

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isEventDetailOpen, onOpen: onEventDetailOpen, onClose: onEventDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const validEvents = storedEvents.filter(event => event && typeof event === 'object' && event.id);
    setEvents(validEvents);
  }, []);

  // Memoized filtered and sorted events
  const filteredAndSortedEvents = useMemo(() => {
    let filteredEvents = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.type || event.type === filters.type;
      const matchesStatus = !filters.status || event.status === filters.status;
      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    // Apply sorting
    if (sortConfig.key) {
      filteredEvents.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return filteredEvents;
  }, [events, searchTerm, filters, sortConfig]);

  // Ensure current page is valid when filtered events change
  useEffect(() => {
    const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filteredAndSortedEvents, itemsPerPage, currentPage]);

  // Get current events for the current page
  const currentEvents = useMemo(() => {
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    return filteredAndSortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [filteredAndSortedEvents, currentPage, itemsPerPage]);

  const saveEvents = (updatedEvents) => {
    const validEvents = updatedEvents.filter(event => event && typeof event === 'object' && event.id);
    setEvents(validEvents);
    localStorage.setItem('events', JSON.stringify(validEvents));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    onFilterClose();
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' 
      ? 'descending' 
      : 'ascending';
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
      case 'ongoing':
      case 'delete':
        onConfirmOpen();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmAction = () => {
    let updatedEvents;
    switch (actionType) {
      case 'cancel':
        updatedEvents = events.map(event => 
          event.id === selectedEvent.id ? { ...event, status: 'Cancelled' } : event
        );
        break;
      case 'ongoing':
        updatedEvents = events.map(event => 
          event.id === selectedEvent.id ? { ...event, status: 'Ongoing' } : event
        );
        break;
      case 'delete':
        updatedEvents = events.filter(event => event.id !== selectedEvent.id);
        break;
      default:
        return;
    }
    saveEvents(updatedEvents);
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">Event Management</h1>
      </motion.div>
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
        <Button 
          color="success" 
          onPress={onCreateOpen} 
          startContent={<Plus size={20} />}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
        >
          Create Event
        </Button>
      </div>
      {currentEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">No events found. Create a new event to get started.</p>
        </motion.div>
      ) : (
        <>
          <EventListTable
            events={currentEvents}
            onEventAction={handleEventAction}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          
          {/* Pagination section */}
          <div className="flex justify-center mt-4">
            <Pagination
              total={Math.ceil(filteredAndSortedEvents.length / itemsPerPage)}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              showControls
              showShadow
              variant="flat"
              isDisabled={filteredAndSortedEvents.length <= itemsPerPage}
            />
          </div>
        </>
      )}

      <EventDetailModal
        isOpen={isEventDetailOpen}
        onClose={onEventDetailClose}
        event={selectedEvent}
      />
      <EventFilterModal
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
      <EventConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        eventName={selectedEvent?.name}
      />
    </div>
  );
};

export default EventManagement;