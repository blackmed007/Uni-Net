import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const CustomNavbar = ({ isDarkMode, toggleDarkMode, adminProfile }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
          setIsVisible(false);
        } else { // if scroll up show the navbar
          setIsVisible(true);
        }
        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

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
                  AdminHub
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
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button isIconOnly variant="light" className="text-gray-400 hover:text-gray-100 transition-colors duration-300">
                    <Bell size={24} />
                  </Button>
                </motion.div>
              </NavbarItem>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform hover:scale-110"
                      color="secondary"
                      name={adminProfile.fullName}
                      size="sm"
                      src={adminProfile.profileImage}
                    />
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Profile Actions" 
                    variant="flat"
                    className="bg-gray-800 text-gray-100"
                  >
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{adminProfile.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings" onPress={handleSettingsClick}>
                      My Settings
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger">
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomNavbar;