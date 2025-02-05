import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, useDisclosure, Pagination, Spinner } from "@nextui-org/react";
import { Search, Filter, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

import EventListTable from '../../components/admin/event/EventListTable';
import EventDetailModal from '../../components/admin/event/EventDetailModal';
import EventFilterModal from '../../components/admin/event/EventFilterModal';
import CreateEventModal from '../../components/admin/event/CreateEventModal';
import EditEventModal from '../../components/admin/event/EditEventModal';
import EventConfirmActionModal from '../../components/admin/event/EventConfirmActionModal';
import EventsAPI from '../../services/events.api';

const EventManagement = () => {
  // State Management
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
  
  // Enhanced loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal controls using useDisclosure
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

  // Fetch events with improved error handling
  const fetchEvents = useCallback(async (showLoading = true) => {
    try {
      // Determine which loading state to use
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      setError(null);
      
      // Prepare filters for API call
      const fetchedEvents = await EventsAPI.getEvents({
        type: filters.type,
        status: filters.status,
        date: filters.date,
        search: searchTerm
      });

      setEvents(fetchedEvents);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        err.message || 
        'Failed to fetch events. Please try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, searchTerm]);

  // Initial and filtered fetch effect
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Memoized filtered and sorted events
  const filteredAndSortedEvents = useMemo(() => {
    let processedEvents = [...events];

    if (sortConfig.key) {
      processedEvents.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        return sortConfig.direction === 'ascending' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue > bValue ? -1 : 1);
      });
    }

    return processedEvents;
  }, [events, sortConfig]);

  // Pagination calculations
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedEvents.slice(startIndex, endIndex);
  }, [filteredAndSortedEvents, currentPage, itemsPerPage]);

  // Event Handlers
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
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedEvent) return;

    try {
      setIsProcessing(true);
      
      switch (actionType) {
        case 'cancel':
          await EventsAPI.updateEventStatus(selectedEvent.id, 'Cancelled');
          toast.success('Event cancelled successfully');
          break;
          
        case 'ongoing':
          await EventsAPI.updateEventStatus(selectedEvent.id, 'Ongoing');
          toast.success('Event marked as ongoing');
          break;
          
        case 'delete':
          await EventsAPI.deleteEvent(selectedEvent.id);
          toast.success('Event deleted successfully');
          break;
      }
      
      await fetchEvents(false);
      onConfirmClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        'Failed to perform action. Please try again.';
      
      toast.error(errorMessage);
      console.error('Event action error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateEvent = async (newEvent) => {
    try {
      setIsProcessing(true);
      await EventsAPI.createEvent(newEvent);
      
      toast.success('Event created successfully');
      await fetchEvents(false);
      onCreateClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        'Failed to create event. Please try again.';
      
      toast.error(errorMessage);
      console.error('Create event error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      setIsProcessing(true);
      await EventsAPI.updateEvent(updatedEvent.id, updatedEvent);
      
      toast.success('Event updated successfully');
      await fetchEvents(false);
      onEditClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        'Failed to update event. Please try again.';
      
      toast.error(errorMessage);
      console.error('Update event error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Retry fetching events
  const handleRetryFetch = () => {
    fetchEvents();
  };

  // Error state rendering
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="text-center">
          <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            color="primary" 
            size="lg" 
            onClick={handleRetryFetch}
          >
            Retry Fetching Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Event Management</h1>
      </motion.div>

      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button 
          color="success" 
          onPress={onCreateOpen} 
          startContent={<Plus size={20} />}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
        >
          Create Event
        </Button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="primary" />
        </div>
      ) : paginatedEvents.length === 0 ? (
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
          {isRefreshing && (
            <div className="absolute top-0 right-0 m-4 z-50">
              <Spinner size="sm" color="primary" />
            </div>
          )}
          <EventListTable
            events={paginatedEvents}
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
        isLoading={isProcessing}
      />
      
      <EditEventModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        event={selectedEvent}
        onSave={handleEditEvent}
        isLoading={isProcessing}
      />
      
      <EventConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        eventName={selectedEvent?.name}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default EventManagement;