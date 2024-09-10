import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";
import RealTimeNotifications from './RealTimeNotifications';

const UserNavbar = ({ isDarkMode, toggleDarkMode, user }) => {
  return (
    <Navbar isBordered className="bg-background">
      <NavbarBrand>
        <p className="font-bold text-inherit">UniConnect</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <RealTimeNotifications userId={user.id} />
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.name}
                size="sm"
                src={user.profileImage}
              />
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Profile Actions" 
              variant="flat"
            >
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default UserNavbar;