import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import RealTimeNotifications from './RealTimeNotifications';

const UserNavbar = ({ isDarkMode, toggleDarkMode, user }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUserData = JSON.parse(localStorage.getItem('userData'));
      if (updatedUserData) {
        setCurrentUser(updatedUserData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
    setIsLogoutModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <Navbar 
            className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg fixed top-0 z-50"
            maxWidth="full"
          >
            <NavbarBrand>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <img src="/assets/home/main-logo.avif" alt="Logo" className="h-8 w-auto" />
                <p className="font-bold text-inherit text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  UniConnect
                </p>
              </motion.div>
            </NavbarBrand>

            <NavbarContent justify="end">
              <NavbarItem>
                <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-800 bg-opacity-50 text-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </motion.div>
              </NavbarItem>
              <NavbarItem>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button isIconOnly variant="light" onClick={toggleDarkMode} className="text-gray-400 hover:text-gray-100 transition-colors duration-300">
                    {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                  </Button>
                </motion.div>
              </NavbarItem>
              <NavbarItem>
                <RealTimeNotifications userId={currentUser.id} />
              </NavbarItem>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform hover:scale-110"
                      color="secondary"
                      name={currentUser.name}
                      size="sm"
                      src={currentUser.profileImage}
                    />
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Profile Actions" 
                    variant="flat"
                    className="bg-gray-800 text-gray-100"
                  >
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{currentUser.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings" onPress={() => navigate('/user/settings')}>
                      My Settings
                    </DropdownItem>
                    <DropdownItem key="help_and_feedback" onPress={() => navigate('/user/settings?tab=contact')}>
                      Help & Feedback
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={() => setIsLogoutModalOpen(true)}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>
          </Navbar>

          <Modal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
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
                <Button color="gray" variant="light" onPress={() => setIsLogoutModalOpen(false)}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleLogout}>
                  Log Out
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserNavbar;