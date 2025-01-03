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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculate totals for percentage calculations
  const genderTotal = data.genders.reduce((sum, item) => sum + item.value, 0);
  const roleTotal = data.roles.reduce((sum, item) => sum + item.value, 0);

  // Add total to each item for tooltip percentage calculation
  const genderData = data.genders.map(item => ({ ...item, total: genderTotal }));
  const roleData = data.roles.map(item => ({ ...item, total: roleTotal }));

  if (isLoading) return <div>Loading user distribution data...</div>;
  if (error) return <div>Error: {error}</div>;

  const ChartSection = ({ title, data, colors }) => (
    <div className="w-1/2 h-full">
      <h3 className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold text-center mb-2 text-gray-300`}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={isMobile ? 210 : "90%"}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 29 : 30}
            outerRadius={isMobile ? 46 : 50}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={isMobile ? null : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={isMobile ? 35 : 36}
            iconType="circle"
            iconSize={isMobile ? 8 : 8}
            wrapperStyle={{ 
              fontSize: isMobile ? '10px' : '10px',
              paddingTop: isMobile ? '10px' : '0'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="w-full h-full flex">
      <ChartSection 
        title="Gender Distribution" 
        data={genderData} 
        colors={GENDER_COLORS} 
      />
      <ChartSection 
        title="User Roles" 
        data={roleData} 
        colors={ROLE_COLORS} 
      />
    </div>
  );
};

export default UserDistribution;