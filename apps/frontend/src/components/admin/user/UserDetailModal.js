import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalBody, 
  Button, 
  Avatar, 
  Chip, 
  Tooltip,
  Spinner,
  Card,
  ScrollShadow,
  Divider
} from "@nextui-org/react";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Activity, 
  Edit2, 
  Ban, 
  UserCheck, 
  Trash2, 
  AlertTriangle,
  Clock,
  MapPinIcon,
  Users,
  CircleUser,
  CircleUserRound
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UsersAPI from '../../../services/users.api';

const UserDetailModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onEditUser, 
  onDeleteUser, 
  onSuspendUser, 
  onActivateUser 
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [userDetails, setUserDetails] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState({
    details: null,
    activity: null,
    events: null
  });

  useEffect(() => {
    if (!user?.id || !isOpen) return;

    const fetchUserDetails = async () => {
      setIsLoadingDetails(true);
      setError(prev => ({ ...prev, details: null }));
      
      try {
        const details = await UsersAPI.getUser(user.id);
        setUserDetails(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError(prev => ({ 
          ...prev, 
          details: 'Failed to load user details. Please try again.' 
        }));
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, isOpen]);

  useEffect(() => {
    if (!user?.id || !isOpen || activeTab !== 'activity') return;

    const fetchUserActivity = async () => {
      setIsLoadingActivity(true);
      setError(prev => ({ ...prev, activity: null }));
      
      try {
        const activity = await UsersAPI.getUserActivity(user.id);
        setUserActivity(activity || []);
      } catch (error) {
        console.error('Error fetching user activity:', error);
      } finally {
        setIsLoadingActivity(false);
      }
    };

    fetchUserActivity();
  }, [user?.id, isOpen, activeTab]);

  useEffect(() => {
    if (!user?.id || !isOpen || activeTab !== 'events') return;

    const fetchUserEvents = async () => {
      setIsLoadingEvents(true);
      setError(prev => ({ ...prev, events: null }));
      
      try {
        const events = await UsersAPI.getUserEvents(user.id);
        setUserEvents(events || []);
      } catch (error) {
        console.error('Error fetching user events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchUserEvents();
  }, [user?.id, isOpen, activeTab]);

  if (!user) return null;

  const tabs = [
    { key: "info", label: "Overview", icon: User },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "events", label: "Joined Events", icon: Calendar }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const renderActivityItem = (activity) => (
    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
      <div className="bg-purple-500/20 p-2 rounded-full">
        <CircleUserRound size={16} className="text-purple-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-300">{activity.activity}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(activity.createdAt)}
        </p>
      </div>
    </div>
  );

  const renderEventItem = (event) => (
    <Card key={event.id} className="bg-gray-800/50 p-4 mb-3">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-semibold text-white">{event.name}</h3>
          <Chip size="sm" variant="flat" color="primary">
            {event.event_type}
          </Chip>
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-2">
          {event.description}
        </p>

        <Divider className="my-2" />
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-400">
            <Clock size={14} className="mr-2" />
            {formatDate(event.datetime)}
          </div>
          <div className="flex items-center text-gray-400">
            <MapPinIcon size={14} className="mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-400">
            <Users size={14} className="mr-2" />
            {event.max_participants} participants
          </div>
          <div className="flex items-center text-gray-400">
            <Briefcase size={14} className="mr-2" />
            {event.organizer}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    const getLoadingState = () => (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );

    const getErrorState = (errorMessage) => (
      <div className="flex items-center justify-center py-12 text-danger">
        <AlertTriangle className="mr-2" size={20} />
        {errorMessage}
      </div>
    );

    const getEmptyState = (message, icon) => (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
        {icon}
        <p>{message}</p>
      </div>
    );

    switch (activeTab) {
      case "info":
        if (isLoadingDetails) return getLoadingState();
        if (error.details) return getErrorState(error.details);

        return (
          <div className="grid grid-cols-2 gap-6">
            <InfoItem icon={User} label="ID" value={userDetails?.id} />
            <InfoItem icon={Mail} label="Email" value={userDetails?.email} />
            <InfoItem icon={Briefcase} label="Role" value={userDetails?.role} />
            <InfoItem 
              icon={Calendar} 
              label="Joined" 
              value={userDetails?.createdAt ? formatDate(userDetails.createdAt) : 'N/A'} 
            />
            <InfoItem icon={User} label="Gender" value={userDetails?.gender} />
            <InfoItem icon={MapPin} label="University" value={userDetails?.university?.name} />
            <InfoItem icon={MapPin} label="City" value={userDetails?.city?.name} />
          </div>
        );

      case "activity":
        if (isLoadingActivity) return getLoadingState();
        if (error.activity) return getErrorState(error.activity);

        return userActivity.length > 0 ? (
          <ScrollShadow className="h-[400px]">
            <div className="space-y-3">
              {userActivity.map(renderActivityItem)}
            </div>
          </ScrollShadow>
        ) : getEmptyState(
          "No activity recorded yet.",
          <Activity size={40} className="text-gray-500" />
        );

      case "events":
        if (isLoadingEvents) return getLoadingState();
        if (error.events) return getErrorState(error.events);

        return userEvents.length > 0 ? (
          <ScrollShadow className="h-[400px]">
            <div className="space-y-4">
              {userEvents.map(renderEventItem)}
            </div>
          </ScrollShadow>
        ) : getEmptyState(
          "No events joined yet.",
          <Calendar size={40} className="text-gray-500" />
        );

      default:
        return null;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      classNames={{
        base: "bg-gray-950",
        wrapper: "overflow-hidden",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="p-0">
            <div className="bg-gradient-to-br from-gray-1000 to-black p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-6">
                  <Avatar
                    src={userDetails?.profile_url || `https://i.pravatar.cc/150?u=${user.id}`}
                    size="lg"
                    className="ring-2 ring-purple-500"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {userDetails?.firstName} {userDetails?.lastName}
                    </h2>
                    <div className="flex items-center mt-2">
                      <Chip 
                        color={getStatusColor(userDetails?.status)} 
                        size="sm" 
                        className="mr-2"
                      >
                        {userDetails?.status || 'Unknown'}
                      </Chip>
                      <span className="text-sm text-gray-300">{userDetails?.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <ActionButton icon={Edit2} tooltip="Edit User" onClick={() => { onClose(); onEditUser(); }} />
                  {userDetails?.status === 'Active' ? (
                    <ActionButton icon={Ban} tooltip="Suspend User" onClick={() => onSuspendUser(user.id)} color="warning" />
                  ) : (
                    <ActionButton icon={UserCheck} tooltip="Activate User" onClick={() => onActivateUser(user.id)} color="success" />
                  )}
                  <ActionButton icon={Trash2} tooltip="Delete User" onClick={() => onDeleteUser(user.id)} color="danger" />
                </div>
              </div>

              <div className="flex space-x-1 mb-6">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    size="sm"
                    className={`${
                      activeTab === tab.key 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    } transition-all duration-200`}
                    onPress={() => setActiveTab(tab.key)}
                    startContent={<tab.icon size={16} />}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-900/50 p-6 rounded-lg shadow-xl"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>

              {userDetails?.status === 'Suspended' && (
                <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-lg flex items-center space-x-2">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  <span className="text-yellow-100 text-sm">
                    This user account is currently suspended. Review and take appropriate action.
                  </span>
                </div>
              )}
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
    <Icon className="text-purple-400" size={18} />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-white">{value || 'N/A'}</p>
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, tooltip, onClick, color = "default" }) => (
  <Tooltip content={tooltip}>
    <Button isIconOnly size="sm" color={color} variant="flat" onPress={onClick}>
      <Icon size={18} />
    </Button>
  </Tooltip>
);

export default UserDetailModal;