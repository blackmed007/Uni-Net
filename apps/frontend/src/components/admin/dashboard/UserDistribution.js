import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { userDistributionData } from './DummyData_Dash'; // TODO: Remove this import when connecting to backend

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
      >
        <p className="font-bold text-gray-100">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>
          Value: {payload[0].value}
        </p>
      </motion.div>
    );
  }
  return null;
};

const UserDistribution = () => {
  const [data, setData] = useState(userDistributionData); // TODO: Initialize with [] when connecting to backend
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Uncomment and implement the following useEffect when connecting to backend
  /*
  useEffect(() => {
    const fetchUserDistribution = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user-distribution');
        if (!response.ok) {
          throw new Error('Failed to fetch user distribution data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDistribution();
  }, []);
  */

  if (isLoading) return <div>Loading user distribution data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '10px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default UserDistribution;