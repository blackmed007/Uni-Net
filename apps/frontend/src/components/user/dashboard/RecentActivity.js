import React, { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Activity, Users, Calendar, MessageSquare } from "lucide-react";

const RecentActivity = ({ userId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch recent activities from localStorage or API
    // For now, we'll use mock data
    const mockActivities = [
      { id: 1, type: 'join_group', content: 'You joined the study group "Advanced Mathematics"', timestamp: '2023-09-05T14:30:00Z' },
      { id: 2, type: 'register_event', content: 'You registered for the event "Web Development Workshop"', timestamp: '2023-09-04T10:15:00Z' },
      { id: 3, type: 'comment', content: 'You commented on a blog post "Tips for Effective Studying"', timestamp: '2023-09-03T16:45:00Z' },
    ];
    setActivities(mockActivities);
  }, [userId]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'join_group':
        return <Users className="text-primary" size={20} />;
      case 'register_event':
        return <Calendar className="text-primary" size={20} />;
      case 'comment':
        return <MessageSquare className="text-primary" size={20} />;
      default:
        return <Activity className="text-primary" size={20} />;
    }
  };

  return (
    <Card>
      <CardBody>
        {activities.length === 0 ? (
          <div className="p-4">No recent activity</div>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center space-x-2">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-sm text-black dark:text-white">{activity.content}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentActivity;