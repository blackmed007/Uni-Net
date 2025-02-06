import React, { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Activity, Users, Calendar, MessageSquare } from "lucide-react";
import UsersAPI from '../../../services/users.api';

const RecentActivity = ({ userId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await UsersAPI.getUserActivity(userId);
        // Only show the last 3 activities
        setActivities(fetchedActivities.slice(0, 3));
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
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