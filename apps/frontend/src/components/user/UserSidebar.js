import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Users, Calendar, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const UserSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/user/dashboard' },
    { name: 'Events', icon: Calendar, path: '/user/events' },
    { name: 'Study Groups', icon: Users, path: '/user/study-groups' },
    { name: 'Blog', icon: FileText, path: '/user/blog' },
    { name: 'Settings', icon: Settings, path: '/user/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
    onClose();
  };

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={toggleSidebar}
      className={`fixed top-11 left-4 z-[60] p-2.5 rounded-full bg-blue-500 text-white shadow-lg ${
        isMobile ? 'block' : 'hidden'
      } hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200`}
      style={{
        display: isMobile ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );

  // Desktop collapse button
  const CollapseButton = () => (
    <motion.button
      onClick={toggleSidebar}
      className={`absolute -right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 rounded-full p-1 focus:outline-none ${
        isMobile ? 'hidden' : 'block'
      }`}
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

  // Desktop Sidebar Content
  const DesktopSidebar = () => (
    <motion.div
      className={`fixed top-0 left-0 h-screen bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg z-50 ${
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
              key={item.path}
              to={item.path}
            >
              <motion.button
                className={`w-full text-left px-4 py-3 mb-2 flex items-center rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-white bg-opacity-10 text-white'
                    : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'
                } transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`flex items-center justify-center ${
                  isCollapsed ? 'w-full' : 'w-8'
                } h-8 rounded-md ${
                  location.pathname === item.path ? 'bg-blue-500' : 'bg-black'
                }`}>
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
            <div className={`flex items-center justify-center ${
              isCollapsed ? 'w-full' : 'w-8'
            } h-8 rounded-md bg-red-500 bg-opacity-20`}>
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
    </motion.div>
  );

  // Mobile Sidebar Content
  const MobileSidebar = () => (
    <motion.div
      className="fixed top-0 left-0 h-screen bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg z-50 w-64"
      initial={{ x: -320 }}
      animate={{ x: isSidebarOpen ? 0 : -320 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div className="flex flex-col h-full pt-16">
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
            >
              <motion.div
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200
                  ${location.pathname === item.path 
                    ? 'bg-white bg-opacity-10 text-white' 
                    : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'}
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  <item.icon size={20} />
                </div>
                <span className="ml-3">{item.name}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <motion.button
            className="flex items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors duration-200"
            onClick={onOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center w-8 h-8">
              <LogOut size={20} />
            </div>
            <span className="ml-3">Log Out</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Render either Desktop or Mobile sidebar based on screen size */}
      {isMobile ? (
        <>
          <MobileSidebar />
          {/* Mobile Backdrop */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <DesktopSidebar />
      )}

      {/* Logout Modal */}
      <Modal
        isOpen={isModalOpen}
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
    </>
  );
};

export default UserSidebar;