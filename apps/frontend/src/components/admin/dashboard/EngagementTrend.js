import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementTrend = ({ data }) => (
  <Card className="w-full bg-white/10 dark:bg-gray-800/50 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700">
    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Engagement Trend</h2>
    </CardHeader>
    <CardBody>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} />
          <Legend />
          <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </CardBody>
  </Card>
);

EngagementTrend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      engagement: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default EngagementTrend;