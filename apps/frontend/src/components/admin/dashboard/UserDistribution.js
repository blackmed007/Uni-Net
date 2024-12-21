import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { userDistributionData } from './DummyData_Dash';

const GENDER_COLORS = ['#3B82F6', '#EC4899'];
const ROLE_COLORS = ['#10B981', '#8B5CF6', '#F59E0B'];

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
          Count: {payload[0].value}
        </p>
        <p style={{ color: payload[0].payload.fill }}>
          Percentage: {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </motion.div>
    );
  }
  return null;
};

const UserDistribution = () => {
  const [data, setData] = useState(userDistributionData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate totals for percentage calculations
  const genderTotal = data.genders.reduce((sum, item) => sum + item.value, 0);
  const roleTotal = data.roles.reduce((sum, item) => sum + item.value, 0);

  // Add total to each item for tooltip percentage calculation
  const genderData = data.genders.map(item => ({ ...item, total: genderTotal }));
  const roleData = data.roles.map(item => ({ ...item, total: roleTotal }));

  if (isLoading) return <div>Loading user distribution data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full h-full flex">
      {/* Gender Distribution */}
      <div className="w-1/2 h-full">
        <h3 className="text-sm font-semibold text-center mb-2 text-gray-300">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={genderData}
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
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
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
      </div>

      {/* Role Distribution */}
      <div className="w-1/2 h-full">
        <h3 className="text-sm font-semibold text-center mb-2 text-gray-300">User Roles</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={roleData}
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
              {roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
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
      </div>
    </div>
  );
};

export default UserDistribution;