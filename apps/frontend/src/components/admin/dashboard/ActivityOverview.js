import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { activityData } from './DummyData_Dash';

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
  const [data, setData] = useState(activityData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Uncomment and implement the following useEffect when connecting to backend
  /*
  useEffect(() => {
    const fetchActivityData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
        
        const response = await fetch(`/api/activity-data?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
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
          <linearGradient id="colorBlogPosts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
          </linearGradient>
        </defs>
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
        <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="users" 
          stroke="#3B82F6" 
          fillOpacity={1} 
          fill="url(#colorUsers)" 
          name="Users"
        />
        <Area 
          type="monotone" 
          dataKey="events" 
          stroke="#10B981" 
          fillOpacity={1} 
          fill="url(#colorEvents)" 
          name="Events"
        />
        <Area 
          type="monotone" 
          dataKey="blogPosts" 
          stroke="#8B5CF6" 
          fillOpacity={1} 
          fill="url(#colorBlogPosts)" 
          name="Blog Posts"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ActivityOverview;