import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Users, BarChart2, Calendar, Settings, ChevronLeft, ChevronRight, BookOpen, FileText, Bell } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, isDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: BarChart2, tab: 'dashboard' },
    { name: 'Users', icon: Users, tab: 'users' },
    { name: 'Events', icon: Calendar, tab: 'events' },
    { name: 'Study Groups', icon: BookOpen, tab: 'studygroups' },
    { name: 'Blog', icon: FileText, tab: 'blog' },
    { name: 'Notifications', icon: Bell, tab: 'notifications' },
    { name: 'Settings', icon: Settings, tab: 'settings' },
  ];

  return (
    <motion.div
      className={`${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      } h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out shadow-lg`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl font-bold">AdminHub</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
          } transition-colors duration-200`}
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <button
            key={item.tab}
            className={`w-full text-left px-4 py-3 mb-2 flex items-center ${
              activeTab === item.tab
                ? isDarkMode 
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-600'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-200'
            } transition-colors duration-200`}
            onClick={() => setActiveTab(item.tab)}
          >
            <item.icon className={isCollapsed ? 'mx-auto' : 'mr-3'} size={24} />
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;