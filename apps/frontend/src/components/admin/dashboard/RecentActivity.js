import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, MessageCircle, BookOpen } from "lucide-react";

const activityData = [
  { icon: UserPlus, text: "New user registered: Sarah Johnson", time: "2 minutes ago", type: "user" },
  { icon: Calendar, text: "Event created: Web Development Workshop", time: "1 hour ago", type: "event" },
  { icon: MessageCircle, text: "New forum post: 'Tips for Effective Studying'", time: "3 hours ago", type: "forum" },
  { icon: BookOpen, text: "Study group 'Advanced Mathematics' reached 20 members", time: "5 hours ago", type: "studyGroup" },
];

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

const RecentActivity = () => (
  <ul className="space-y-4">
    {activityData.map((item, index) => (
      <motion.li 
        key={index} 
        className="flex items-center space-x-3 bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-md backdrop-filter backdrop-blur-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className={`p-2 rounded-full ${getActivityColor(item.type)}`}>
          <item.icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-100">{item.text}</p>
          <p className="text-xs text-gray-400">{item.time}</p>
        </div>
      </motion.li>
    ))}
  </ul>
);

export default RecentActivity;