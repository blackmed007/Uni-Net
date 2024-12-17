import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { engagementData } from './DummyData_Dash'; // TODO: Remove this import when connecting to backend

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

const EngagementTrend = () => {
  const [data, setData] = useState(engagementData); // TODO: Initialize with [] when connecting to backend
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Uncomment and implement the following useEffect when connecting to backend
  /*
  useEffect(() => {
    const fetchEngagementData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/engagement-data');
        if (!response.ok) {
          throw new Error('Failed to fetch engagement data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEngagementData();
  }, []);
  */

  if (isLoading) return <div>Loading engagement data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
        <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
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