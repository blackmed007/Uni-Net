import React, { useState, useEffect } from 'react';
import { Badge, Popover, PopoverTrigger, PopoverContent, Button, Card, CardBody } from "@nextui-org/react";
import { Bell } from "lucide-react";

const RealTimeNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial notifications
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = storedNotifications.filter(notification => 
      notification.recipients.includes(userId) || notification.recipients.includes('all')
    );
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.read).length);

    // Set up a polling mechanism to check for new notifications
    const intervalId = setInterval(() => {
      const updatedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedUserNotifications = updatedNotifications.filter(notification => 
        notification.recipients.includes(userId) || notification.recipients.includes('all')
      );
      setNotifications(updatedUserNotifications);
      setUnreadCount(updatedUserNotifications.filter(n => !n.read).length);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [userId]);

  const handleMarkAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="light">
          <Badge content={unreadCount} color="danger" shape="circle">
            <Bell size={24} />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Card>
          <CardBody className="p-0">
            {notifications.length === 0 ? (
              <p className="p-4">No new notifications</p>
            ) : (
              <ul className="max-h-96 overflow-auto">
                {notifications.map(notification => (
                  <li key={notification.id} className="p-4 border-b last:border-b-0">
                    <div className={`mb-2 ${notification.read ? 'text-gray-500' : 'font-semibold'}`}>
                      {notification.title}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                    {!notification.read && (
                      <Button 
                        size="sm" 
                        color="primary" 
                        variant="light" 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="mt-2"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default RealTimeNotifications;