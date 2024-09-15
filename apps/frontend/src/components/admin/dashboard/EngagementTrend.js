import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', engagement: 65 },
  { name: 'Feb', engagement: 59 },
  { name: 'Mar', engagement: 80 },
  { name: 'Apr', engagement: 72 },
  { name: 'May', engagement: 76 },
  { name: 'Jun', engagement: 82 },
  { name: 'Jul', engagement: 79 },
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
        <p className="text-purple-400">
          Engagement: {payload[0].value}%
        </p>
      </motion.div>
    );
  }
  return null;
};

const EngagementTrend = () => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="name" stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" />
      <Tooltip content={<CustomTooltip />} />
      <defs>
        <linearGradient id="colorEngagement" x1="0" y1="0" x2="1" y2="0">
          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#D946EF" stopOpacity={0.8}/>
        </linearGradient>
      </defs>
      <Line 
        type="monotone" 
        dataKey="engagement" 
        stroke="url(#colorEngagement)" 
        strokeWidth={3}
        dot={{ r: 6, strokeWidth: 2, fill: '#1F2937' }}
        activeDot={{ r: 8, strokeWidth: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default EngagementTrend;