import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, MessageCircle, BookOpen } from "lucide-react";
import { recentActivityData } from './DummyData_Dash'; 

const getActivityColor = (type) => {
  switch (type) {
    case 'user':
      return 'bg-blue-500 text-blue-100';
    case 'event':
      return 'bg-green-500 text-green-100';
    case 'forum':
      return 'bg-yellow-500 text-yellow-100';
    case 'studyGroup':
      return 'bg-purple-500 text-purple-100';
    default:
      return 'bg-gray-500 text-gray-100';
  }
};

const getIcon = (iconName) => {
  switch (iconName) {
    case 'UserPlus':
      return UserPlus;
    case 'Calendar':
      return Calendar;
    case 'MessageCircle':
      return MessageCircle;
    case 'BookOpen':
      return BookOpen;
    default:
      return UserPlus;
  }
};

const RecentActivity = () => {
  const [activityData, setActivityData] = useState(recentActivityData); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 

  if (isLoading) return <div>Loading recent activity...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul className="space-y-2">
      {activityData.map((item, index) => {
        const Icon = getIcon(item.icon);
        return (
          <motion.li 
            key={index} 
            className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 p-2 rounded-lg shadow-md backdrop-filter backdrop-blur-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className={`p-1 rounded-full ${getActivityColor(item.type)}`}>
              <Icon className="w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-100">{item.text}</p>
              <p className="text-xxs text-gray-400">{item.time}</p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default RecentActivity;