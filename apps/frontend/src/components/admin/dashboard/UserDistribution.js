import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockPieData = [
  { name: 'Students', value: 400 },
  { name: 'Teachers', value: 300 },
  { name: 'Admins', value: 50 },
  { name: 'Guests', value: 100 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const UserDistribution = () => (
  <Card className="w-full bg-white/10 dark:bg-gray-800/50 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700">
    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">User Distribution</h2>
    </CardHeader>
    <CardBody>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockPieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {mockPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardBody>
  </Card>
);

export default UserDistribution;