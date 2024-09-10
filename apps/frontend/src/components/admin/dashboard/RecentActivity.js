import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { UserPlus, Calendar, MessageCircle, BookOpen } from "lucide-react";

const activityData = [
  { icon: UserPlus, text: "New user registered: Sarah Johnson", time: "2 minutes ago" },
  { icon: Calendar, text: "Event created: Web Development Workshop", time: "1 hour ago" },
  { icon: MessageCircle, text: "New forum post: 'Tips for Effective Studying'", time: "3 hours ago" },
  { icon: BookOpen, text: "Study group 'Advanced Mathematics' reached 20 members", time: "5 hours ago" },
];

const RecentActivity = () => (
  <Card className="w-full bg-white/10 dark:bg-gray-800/50 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700">
    <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
    </CardHeader>
    <CardBody>
      <ul className="space-y-4">
        {activityData.map((item, index) => (
          <li key={index} className="flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <item.icon className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);

export default RecentActivity;