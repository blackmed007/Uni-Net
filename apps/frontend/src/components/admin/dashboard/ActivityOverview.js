import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', users: 400, events: 240, studyGroups: 240 },
  { name: 'Feb', users: 300, events: 139, studyGroups: 221 },
  { name: 'Mar', users: 200, events: 980, studyGroups: 229 },
  { name: 'Apr', users: 278, events: 390, studyGroups: 200 },
  { name: 'May', users: 189, events: 480, studyGroups: 218 },
  { name: 'Jun', users: 239, events: 380, studyGroups: 250 },
  { name: 'Jul', users: 349, events: 430, studyGroups: 210 },
];

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

const ActivityOverview = () => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
      <XAxis dataKey="name" stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
      <Area type="monotone" dataKey="events" stroke="#10B981" fillOpacity={1} fill="url(#colorEvents)" />
      <Area type="monotone" dataKey="studyGroups" stroke="#F59E0B" fillOpacity={1} fill="url(#colorStudyGroups)" />
    </AreaChart>
  </ResponsiveContainer>
);

export default ActivityOverview;