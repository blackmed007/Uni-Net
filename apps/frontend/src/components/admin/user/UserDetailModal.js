import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalBody, 
  Button, 
  Avatar, 
  Chip, 
  Tooltip,
  Spinner 
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
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UsersAPI from '../../../services/users.api';

const UserDetailModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onEditUser, 
  onDeleteUser, 
  onBanUser, 
  onActivateUser 
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id || !isOpen) return;

      setIsLoading(true);
      setError(null);
      
      try {
        const [details, events, activity] = await Promise.all([
          UsersAPI.getUser(user.id),
          UsersAPI.getUserEvents(user.id),
          UsersAPI.getUserActivity(user.id)
        ]);

        setUserDetails({
          ...details,
          events,
          activity
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, isOpen]);

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-12 text-danger">
          <AlertTriangle className="mr-2" size={20} />
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case "info":
        return (
          <div className="grid grid-cols-2 gap-6">
            <InfoItem icon={User} label="ID" value={userDetails?.id} />
            <InfoItem icon={Mail} label="Email" value={userDetails?.email} />
            <InfoItem icon={Briefcase} label="Role" value={userDetails?.role} />
            <InfoItem 
              icon={Calendar} 
              label="Joined" 
              value={userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'} 
            />
            <InfoItem icon={User} label="Gender" value={userDetails?.gender} />
            <InfoItem icon={MapPin} label="University" value={userDetails?.university?.name} />
            <InfoItem icon={MapPin} label="City" value={userDetails?.city?.name} />
          </div>
        );
      case "activity":
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">Recent activities</div>
            {userDetails?.activity && userDetails.activity.length > 0 ? (
              userDetails.activity.map((item, index) => (
                <ActivityItem 
                  key={index}
                  action={item.action}
                  timestamp={item.timestamp}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No activity records found
              </div>
            )}
          </div>
        );
      case "events":
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">Joined events</div>
            {userDetails?.events && userDetails.events.length > 0 ? (
              userDetails.events.map((event, index) => (
                <EventItem 
                  key={index}
                  name={event.name}
                  date={new Date(event.datetime).toLocaleDateString()}
                  location={event.location}
                  status={new Date(event.datetime) > new Date() ? 'Upcoming' : 'Completed'}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No events joined yet
              </div>
            )}
          </div>
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
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="p-0">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8">
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
                    <ActionButton icon={Ban} tooltip="Suspend User" onClick={() => onBanUser(user.id)} color="warning" />
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
                  className="bg-gray-900 p-6 rounded-lg shadow-xl"
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

const ActivityItem = ({ action, timestamp }) => (
  <div className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg">
    <span className="text-sm text-white">{action}</span>
    <span className="text-xs text-gray-400">
      {new Date(timestamp).toLocaleString()}
    </span>
  </div>
);

const EventItem = ({ name, date, location, status }) => (
  <div className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg">
    <div>
      <span className="text-sm font-medium text-white">{name}</span>
      <div className="flex items-center mt-1">
        <Calendar size={12} className="text-gray-400 mr-2" />
        <span className="text-xs text-gray-400">{date}</span>
        <MapPin size={12} className="text-gray-400 ml-4 mr-2" />
        <span className="text-xs text-gray-400">{location}</span>
      </div>
    </div>
    <Chip 
      size="sm" 
      color={status === 'Upcoming' ? 'warning' : 'success'}
    >
      {status}
    </Chip>
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