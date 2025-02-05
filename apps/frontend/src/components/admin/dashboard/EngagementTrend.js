import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { engagementData } from './DummyData_Dash';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
      >
        <p className="font-bold text-gray-100">{data.fullName} {data.year}</p>
        <p className="text-purple-400">
          Engagement: {payload[0].value}%
        </p>
      </motion.div>
    );
  }
  return null;
};

const EngagementTrend = () => {
  const [data, setData] = useState(engagementData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  if (isLoading) return <div>Loading engagement data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF" 
          tick={{ fontSize: 10 }}
          tickFormatter={(value, index) => {
            const monthData = data[index];
            return `${value} ${monthData.year.toString().substr(2)}`;
          }}
        />
        <YAxis 
          stroke="#9CA3AF" 
          tick={{ fontSize: 10 }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
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
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: '#1F2937' }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EngagementTrend;