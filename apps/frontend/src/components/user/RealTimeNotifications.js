import React, { useState, useEffect } from 'react';
import { Badge, Popover, PopoverTrigger, PopoverContent, Button, Card, CardBody } from "@nextui-org/react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RealTimeNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = storedNotifications.filter(notification => 
      notification.recipients.includes(userId) || notification.recipients.includes('all')
    );
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.read).length);

    const intervalId = setInterval(() => {
      const updatedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedUserNotifications = updatedNotifications.filter(notification => 
        notification.recipients.includes(userId) || notification.recipients.includes('all')
      );
      setNotifications(updatedUserNotifications);
      setUnreadCount(updatedUserNotifications.filter(n => !n.read).length);
    }, 30000);

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
            <Bell size={24} className="text-white" />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Card className="bg-gray-800 border border-gray-700">
          <CardBody className="p-0">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 text-gray-300"
                >
                  No new notifications
                </motion.p>
              ) : (
                <ul className="max-h-96 overflow-auto">
                  {notifications.map(notification => (
                    <motion.li 
                      key={notification.id} 
                      className="p-4 border-b border-gray-700 last:border-b-0"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className={`mb-2 ${notification.read ? 'text-gray-400' : 'text-white font-semibold'}`}>
                        {notification.title}
                      </div>
                      <p className="text-sm text-gray-400">{notification.message}</p>
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          color="primary" 
                          variant="flat" 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="mt-2"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default RealTimeNotifications;