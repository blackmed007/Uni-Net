import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Students', value: 400 },
  { name: 'Teachers', value: 300 },
  { name: 'Admins', value: 50 },
  { name: 'Guests', value: 100 },
];

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

const UserDistribution = () => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
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
      />
    </PieChart>
  </ResponsiveContainer>
);

export default UserDistribution;