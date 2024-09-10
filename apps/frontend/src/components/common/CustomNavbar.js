import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Bell, Moon, Sun } from "lucide-react";

const CustomNavbar = ({ isDarkMode, toggleDarkMode, adminProfile }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  return (
    <Navbar isBordered className="bg-background">
      <NavbarBrand>
        <p className="font-bold text-inherit">AdminHub</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button isIconOnly variant="light">
            <Bell size={24} />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={adminProfile.fullName}
                size="sm"
                src={adminProfile.profileImage}
              />
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Profile Actions" 
              variant="flat"
              classNames={{
                base: "bg-background",
                content: "text-foreground",
              }}
            >
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold text-black dark:text-white">Signed in as</p>
                <p className="font-semibold text-black dark:text-white">{adminProfile.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" className="text-foreground" onPress={handleSettingsClick}>
                My Settings
              </DropdownItem>
              <DropdownItem key="logout" color="danger" className="text-danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default CustomNavbar;