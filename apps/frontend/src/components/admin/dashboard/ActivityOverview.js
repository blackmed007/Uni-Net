import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { activityData } from './DummyData_Dash'; // TODO: Remove this import when connecting to backend

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
      >
        <p className="font-bold text-gray-100">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

const ActivityOverview = () => {
  const [data, setData] = useState(activityData); // TODO: Initialize with [] when connecting to backend
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Uncomment and implement the following useEffect when connecting to backend
  /*
  useEffect(() => {
    const fetchActivityData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/activity-data');
        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, []);
  */

  if (isLoading) return <div>Loading activity data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorStudyGroups" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
        <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
        <Area type="monotone" dataKey="events" stroke="#10B981" fillOpacity={1} fill="url(#colorEvents)" />
        <Area type="monotone" dataKey="studyGroups" stroke="#F59E0B" fillOpacity={1} fill="url(#colorStudyGroups)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ActivityOverview;