import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ActivityOverview = ({ data }) => (
  <Card className="w-full bg-white/10 dark:bg-gray-800/50 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700">
    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Activity Overview</h2>
    </CardHeader>
    <CardBody>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} />
          <Legend />
          <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
          <Area type="monotone" dataKey="events" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
          <Area type="monotone" dataKey="studyGroups" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </CardBody>
  </Card>
);

ActivityOverview.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      users: PropTypes.number.isRequired,
      events: PropTypes.number.isRequired,
      studyGroups: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ActivityOverview;