import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { motion } from 'framer-motion';
import { Users, BookOpen, Target } from "lucide-react";

const UserDashboard = ({ 
  user, 
  studyGroups, 
  events, 
  NotificationsList, 
  JoinedStudyGroups, 
  RegisteredEvents, 
  RecentActivity 
}) => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(`user_${user.id}_hasVisited`);
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem(`user_${user.id}_hasVisited`, 'true');
    }
  }, [user.id]);

  const joinedGroups = studyGroups.filter(group => 
    Array.isArray(group.members) && group.members.includes(user.id)
  );

  const registeredEvents = events.filter(event => 
    Array.isArray(event.participants) && event.participants.includes(user.id)
  );

  const SummaryCard = ({ title, value, icon: Icon, trend, color }) => {
    const gradientClass = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
    }[color];
  
    return (
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Card className={`bg-gradient-to-br ${gradientClass} text-white shadow-lg rounded-xl overflow-hidden border border-gray-700`}>
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
                <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                </p>
              </div>
              <motion.div 
                className="p-4 bg-white bg-opacity-20 rounded-full"
                whileHover={{ rotate: 15 }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 bg-black min-h-screen">
      {isFirstVisit && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-400 to-pink-600">
            <CardBody>
              <h2 className="text-2xl font-bold text-white">Welcome, {user.firstName}!</h2>
              <p className="text-white">We're excited to have you join UniConnect. Start exploring and connecting with your peers!</p>
            </CardBody>
          </Card>
        </motion.div>
      )}
      <motion.h1 
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Your Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Study Groups" value={joinedGroups.length} icon={Users} trend={5.2} color="blue" />
        <SummaryCard title="Registered Events" value={registeredEvents.length} icon={BookOpen} trend={3.7} color="green" />
        <SummaryCard title="Engagement Rate" value="78%" icon={Target} trend={1.4} color="yellow" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-800 p-4">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Notifications</h2>
            </CardHeader>
            <CardBody className="p-4">
              <NotificationsList userId={user.id} />
            </CardBody>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-800 p-4">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Joined Study Groups</h2>
            </CardHeader>
            <CardBody className="p-4">
              <JoinedStudyGroups groups={joinedGroups} />
            </CardBody>
          </Card>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-800 p-4">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Registered Events</h2>
            </CardHeader>
            <CardBody className="p-4">
              <RegisteredEvents events={registeredEvents} />
            </CardBody>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-800 p-4">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Recent Activity</h2>
            </CardHeader>
            <CardBody className="p-4">
              <RecentActivity userId={user.id} />
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;