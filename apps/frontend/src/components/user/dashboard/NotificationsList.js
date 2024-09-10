import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Bell } from "lucide-react";

const NotificationsList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from localStorage or API
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = storedNotifications.filter(notification => 
      notification.recipients.includes(userId) || notification.recipients.includes('all')
    );
    setNotifications(userNotifications);
  }, [userId]);

  const handleMarkAsRead = (notificationId) => {
    // Update notification status in localStorage or API
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
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
                <div>
                  <p className={`font-medium ${notification.read ? 'text-gray-500' : 'text-black dark:text-white'}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Button size="sm" color="primary" variant="light" onPress={() => handleMarkAsRead(notification.id)}>
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