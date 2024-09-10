import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from "@nextui-org/react";

const SummaryCard = ({ title, value, icon: Icon, trend, color }) => (
  <Card className="w-full bg-white/10 dark:bg-gray-800/50 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700">
    <CardBody className="flex flex-row items-center justify-between p-6">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </p>
      </div>
      <div className={`p-4 rounded-full ${color.replace('text-', 'bg-').replace('500', '100')} bg-opacity-20`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </CardBody>
  </Card>
);

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default SummaryCard;