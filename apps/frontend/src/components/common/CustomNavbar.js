import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import ProfileAPI from '../../services/profile.api';
import { toast } from 'react-hot-toast';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isIconToggled, setIsIconToggled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    profileImage: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await ProfileAPI.getCurrentProfile();
        
        setProfileData({
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          profileImage: data.profileImage || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
        
        // Fallback to a default state
        setProfileData({
          fullName: 'Admin User',
          email: 'admin@example.com',
          profileImage: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsSearchVisible(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  const handleLogout = () => {
    navigate('/login');
    onClose();
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleIconToggle = () => {
    setIsIconToggled(!isIconToggled);
  };

  if (isLoading) {
    return (
      <Navbar className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg fixed top-0 z-50">
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="animate-pulse flex items-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full mr-4"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="navbar" // Unique key for the navbar container
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
                  AdminHub
                </p>
              </motion.div>
            </NavbarBrand>

            <NavbarContent justify="end" className="gap-2">
              {/* Search Input - Responsive */}
              <AnimatePresence>
                {(!isMobile || isSearchVisible) && (
                  <NavbarItem className="flex-grow-0">
                    <motion.div
                      className="relative w-full md:w-auto"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-800 bg-opacity-50 text-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-full md:w-64"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </motion.div>
                  </NavbarItem>
                )}
              </AnimatePresence>

              {/* Mobile Search Toggle */}
              {isMobile && (
                <NavbarItem>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      isIconOnly
                      variant="light"
                      onClick={toggleSearch}
                      className="text-gray-400 hover:text-gray-100 transition-colors duration-300"
                    >
                      <Search size={24} />
                    </Button>
                  </motion.div>
                </NavbarItem>
              )}

              {/* Theme Toggle */}
              <NavbarItem>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    isIconOnly 
                    variant="light" 
                    onClick={handleIconToggle}
                    className="text-gray-400 hover:text-gray-100 transition-colors duration-300"
                  >
                    {isIconToggled ? <Sun size={24} /> : <Moon size={24} />}
                  </Button>
                </motion.div>
              </NavbarItem>

              {/* Notifications */}
              <NavbarItem className="hidden sm:flex">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    isIconOnly 
                    variant="light" 
                    className="text-gray-400 hover:text-gray-100 transition-colors duration-300"
                  >
                    <Bell size={24} />
                  </Button>
                </motion.div>
              </NavbarItem>

              {/* User Profile Dropdown */}
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform hover:scale-110"
                      color="secondary"
                      name={profileData.fullName}
                      size="sm"
                      src={profileData.profileImage}
                    />
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Profile Actions" 
                    variant="flat"
                    className="bg-gray-800 text-gray-100"
                  >
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold text-xs">{profileData.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings" onPress={handleSettingsClick}>
                      My Settings
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={onOpen}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </motion.div>
      )}

      {/* Logout Modal */}
      <Modal
        key="logoutModal" // Unique key for the modal
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
    </AnimatePresence>
  );
};

export default CustomNavbar;
