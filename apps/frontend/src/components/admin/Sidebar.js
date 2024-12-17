import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Users, Calendar, BookOpen, FileText, Bell, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem('activeTab');
    return storedTab || 'dashboard';
  });

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveTab(path);
    localStorage.setItem('activeTab', path);
  }, [location]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, tab: 'dashboard' },
    { name: 'Users', icon: Users, tab: 'users' },
    { name: 'Events', icon: Calendar, tab: 'events' },
    { name: 'Study Groups', icon: BookOpen, tab: 'studygroups' },
    { name: 'Blog', icon: FileText, tab: 'blog' },
    { name: 'Notifications', icon: Bell, tab: 'notifications' },
    { name: 'Settings', icon: Settings, tab: 'settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('activeTab');
    localStorage.removeItem('userData');
    navigate('/login');
    onClose();
  };

  const CollapseButton = () => (
    <motion.button
      onClick={toggleSidebar}
      className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 rounded-full p-1 focus:outline-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6667 5L7.5 10L11.6667 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.button>
  );

  return (
    <motion.div
      className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out relative`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      <div className="flex flex-col h-full">
        <div className="h-16"></div>
        <nav className="flex-1 mt-8 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.tab}
              to={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                localStorage.setItem('activeTab', item.tab);
              }}
            >
              <motion.button
                className={`w-full text-left px-4 py-3 mb-2 flex items-center rounded-lg ${
                  activeTab === item.tab
                    ? 'bg-white bg-opacity-10 text-white'
                    : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'
                } transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`flex items-center justify-center ${isCollapsed ? 'w-full' : 'w-8'} h-8 rounded-md ${activeTab === item.tab ? 'bg-blue-500' : 'bg-black'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <motion.button
            className="w-full text-left px-4 py-3 flex items-center rounded-lg text-red-500 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-all duration-200"
            onClick={onOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`flex items-center justify-center ${isCollapsed ? 'w-full' : 'w-8'} h-8 rounded-md bg-red-500 bg-opacity-20`}>
              <LogOut className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3"
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      <CollapseButton />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          base: "bg-gray-900 text-white",
          header: "border-b border-gray-800",
          body: "py-6",
          footer: "border-t border-gray-800"
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Confirm Logout</h3>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to log out?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="gray" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleLogout}>
              Log Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default Sidebar;