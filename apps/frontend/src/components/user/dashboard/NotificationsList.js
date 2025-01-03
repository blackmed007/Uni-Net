import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Bell } from "lucide-react";

const NotificationsList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = storedNotifications.filter(notification => 
      notification.recipients.includes(userId) || notification.recipients.includes('all')
    );
    // Only take the last 3 notifications
    setNotifications(userNotifications.slice(-3));
  }, [userId]);

  const handleMarkAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update localStorage while preserving other notifications
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedAllNotifications = allNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
  };

  return (
    <Card>
      <CardBody>
        {notifications.length === 0 ? (
          <div className="p-4">No new notifications</div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-center space-x-2 p-2 border-b last:border-b-0">
                <Bell className="text-primary" size={20} />
                <div className="flex-grow">
                  <p className={`font-medium ${notification.read ? 'text-gray-500' : 'text-black dark:text-white'}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Button 
                    size="sm" 
                    color="primary" 
                    variant="light" 
                    onPress={() => handleMarkAsRead(notification.id)}
                    className="min-w-[100px]"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default NotificationsList;