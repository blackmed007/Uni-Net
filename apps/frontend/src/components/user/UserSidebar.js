import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Calendar, Users, FileText, Settings } from "lucide-react";

const UserSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: BarChart2, path: '/user/dashboard' },
    { name: 'Events', icon: Calendar, path: '/user/events' },
    { name: 'Study Groups', icon: Users, path: '/user/study-groups' },
    { name: 'Blog', icon: FileText, path: '/user/blog' },
    { name: 'Settings', icon: Settings, path: '/user/settings' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 h-screen w-64 transition-all duration-300 ease-in-out shadow-lg">
      <div className="p-4">
        <span className="text-xl font-bold text-gray-800 dark:text-white">UniConnect</span>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full text-left px-4 py-3 mb-2 flex items-center ${
              location.pathname === item.path
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            } transition-colors duration-200`}
          >
            <item.icon className="mr-3" size={24} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default UserSidebar;