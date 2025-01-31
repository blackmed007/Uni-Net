import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, useDisclosure, Pagination, Spinner } from "@nextui-org/react";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import EventListTable from '../../components/admin/event/EventListTable';
import EventDetailModal from '../../components/admin/event/EventDetailModal';
import EventFilterModal from '../../components/admin/event/EventFilterModal';
import CreateEventModal from '../../components/admin/event/CreateEventModal';
import EditEventModal from '../../components/admin/event/EditEventModal';
import EventConfirmActionModal from '../../components/admin/event/EventConfirmActionModal';
import EventsAPI from '../../services/events.api';
import { toast } from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const { 
    isOpen: isFilterOpen, 
    onOpen: onFilterOpen, 
    onClose: onFilterClose 
  } = useDisclosure();
  
  const { 
    isOpen: isEventDetailOpen, 
    onOpen: onEventDetailOpen, 
    onClose: onEventDetailClose 
  } = useDisclosure();
  
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onClose: onCreateClose 
  } = useDisclosure();
  
  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onClose: onEditClose 
  } = useDisclosure();
  
  const { 
    isOpen: isConfirmOpen, 
    onOpen: onConfirmOpen, 
    onClose: onConfirmClose 
  } = useDisclosure();

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedEvents = await EventsAPI.getEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError('Failed to fetch events');
      toast.error('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Memoized filtered and sorted events
  const filteredAndSortedEvents = useMemo(() => {
    let filteredEvents = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.type || event.event_type === filters.type;
      const matchesStatus = !filters.status || event.event_status === filters.status;
      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

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

  // Get current events for pagination
  const currentEvents = useMemo(() => {
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    return filteredAndSortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [filteredAndSortedEvents, currentPage, itemsPerPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

  const handleConfirmAction = async () => {
    try {
      switch (actionType) {
        case 'cancel':
          await EventsAPI.updateEvent(selectedEvent.id, {
            ...selectedEvent,
            event_status: 'Cancelled'
          });
          break;
        case 'ongoing':
          await EventsAPI.updateEvent(selectedEvent.id, {
            ...selectedEvent,
            event_status: 'Ongoing'
          });
          break;
        case 'delete':
          await EventsAPI.deleteEvent(selectedEvent.id);
          break;
        default:
          return;
      }
      
      toast.success('Event updated successfully');
      fetchEvents(); // Refresh the events list
      onConfirmClose();
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
    }
  };

  const handleCreateEvent = async (newEvent) => {
    try {
      await EventsAPI.createEvent(newEvent);
      toast.success('Event created successfully');
      fetchEvents();
      onCreateClose();
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      await EventsAPI.updateEvent(updatedEvent.id, updatedEvent);
      toast.success('Event updated successfully');
      fetchEvents();
      onEditClose();
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-danger mb-4">{error}</p>
        <Button color="primary" onClick={fetchEvents}>
          Retry
        </Button>
      </div>
    );
  }

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
        <Button 
          color="primary" 
          onPress={onFilterOpen} 
          startContent={<Filter size={20} />}
        >
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : currentEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">
            No events found. Create a new event to get started.
          </p>
        </motion.div>
      ) : (
        <>
          <EventListTable
            events={currentEvents}
            onEventAction={handleEventAction}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          
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

      {/* Modals */}
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