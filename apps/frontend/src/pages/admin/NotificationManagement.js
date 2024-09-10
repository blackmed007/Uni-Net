import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { Search, Filter, Plus } from "lucide-react";
import NotificationListTable from '../../components/admin/notification/NotificationListTable';
import NotificationDetailModal from '../../components/admin/notification/NotificationDetailModal';
import FilterModal from '../../components/common/FilterModal';
import CreateNotificationModal from '../../components/admin/notification/CreateNotificationModal';
import EditNotificationModal from '../../components/admin/notification/EditNotificationModal';
import ConfirmActionModal from '../../components/common/ConfirmActionModal';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [actionType, setActionType] = useState('');
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isNotificationDetailOpen, onOpen: onNotificationDetailOpen, onClose: onNotificationDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  useEffect(() => {
    // Fetch notifications from API or local storage
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    onFilterClose();
  };

  const handleNotificationAction = (action, notification) => {
    setSelectedNotification(notification);
    setActionType(action);
    switch (action) {
      case 'view':
        onNotificationDetailOpen();
        break;
      case 'edit':
        onEditOpen();
        break;
      case 'delete':
        onConfirmOpen();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmAction = () => {
    if (actionType === 'delete') {
      const updatedNotifications = notifications.filter(notification => notification.id !== selectedNotification.id);
      saveNotifications(updatedNotifications);
    }
    onConfirmClose();
  };

  const handleEditNotification = (updatedNotification) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === updatedNotification.id ? updatedNotification : notification
    );
    saveNotifications(updatedNotifications);
    onEditClose();
  };

  const handleCreateNotification = (newNotification) => {
    const notificationWithId = { ...newNotification, id: Date.now() };
    const updatedNotifications = [...notifications, notificationWithId];
    saveNotifications(updatedNotifications);
    onCreateClose();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Notification Management</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button color="primary" onPress={onFilterOpen} startContent={<Filter size={20} />}>
          Filters
        </Button>
        <Button color="success" onPress={onCreateOpen} startContent={<Plus size={20} />}>
          Create Notification
        </Button>
      </div>
      <NotificationListTable
        notifications={notifications}
        searchTerm={searchTerm}
        filters={filters}
        onNotificationAction={handleNotificationAction}
      />
      <NotificationDetailModal
        isOpen={isNotificationDetailOpen}
        onClose={onNotificationDetailClose}
        notification={selectedNotification}
      />
      <FilterModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={handleFilter}
        initialFilters={filters}
      />
      <CreateNotificationModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSave={handleCreateNotification}
      />
      <EditNotificationModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        notification={selectedNotification}
        onSave={handleEditNotification}
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

export default NotificationManagement;