import React, { useState } from 'react';
import { Modal, ModalContent, ModalBody, Button, Avatar, Chip, Tooltip } from "@nextui-org/react";
import { User, Mail, Calendar, MapPin, Briefcase, Users, Activity, Edit2, Ban, UserCheck, Trash2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserDetailModal = ({ isOpen, onClose, user, onEditUser, onDeleteUser, onBanUser, onActivateUser }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!user) return null;

  const tabs = [
    { key: "info", label: "Overview", icon: User },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "groups", label: "Groups", icon: Users },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'banned': return 'danger';
      default: return 'default';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="grid grid-cols-2 gap-6">
            <InfoItem icon={User} label="ID" value={user.id} />
            <InfoItem icon={Mail} label="Email" value={user.email} />
            <InfoItem icon={Briefcase} label="Role" value={user.role} />
            <InfoItem icon={Calendar} label="Joined" value={new Date(user.registrationDate).toLocaleDateString()} />
            <InfoItem icon={Users} label="Gender" value={user.gender} />
            <InfoItem icon={MapPin} label="University" value={user.university} />
            <InfoItem icon={MapPin} label="City" value={user.city} />
          </div>
        );
      case "activity":
        return (
          <div className="space-y-4">
            <ActivityItem action="Logged in" timestamp="2023-09-05 14:30" />
            <ActivityItem action="Updated profile picture" timestamp="2023-09-04 10:15" />
            <ActivityItem action="Joined study group 'Advanced Mathematics'" timestamp="2023-09-03 16:45" />
          </div>
        );
      case "groups":
        return (
          <div className="space-y-4">
            <GroupItem name="Advanced Mathematics" members={15} role="Member" />
            <GroupItem name="Python Programming" members={20} role="Admin" />
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
                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                    size="lg"
                    className="ring-2 ring-purple-500"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                    <div className="flex items-center mt-2">
                      <Chip color={getStatusColor(user.status)} size="sm" className="mr-2">{user.status}</Chip>
                      <span className="text-sm text-gray-300">{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <ActionButton icon={Edit2} tooltip="Edit User" onClick={() => { onClose(); onEditUser(); }} />
                  {user.status === 'Active' ? (
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

              {user.status === 'Suspended' && (
                <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-lg flex items-center space-x-2">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  <span className="text-yellow-100 text-sm">This user account is currently suspended. Review and take appropriate action.</span>
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
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ action, timestamp }) => (
  <div className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg">
    <span className="text-sm text-white">{action}</span>
    <span className="text-xs text-gray-400">{timestamp}</span>
  </div>
);

const GroupItem = ({ name, members, role }) => (
  <div className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-lg">
    <div>
      <span className="text-sm font-medium text-white">{name}</span>
      <p className="text-xs text-gray-400">{members} members</p>
    </div>
    <Chip size="sm" color="secondary">{role}</Chip>
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