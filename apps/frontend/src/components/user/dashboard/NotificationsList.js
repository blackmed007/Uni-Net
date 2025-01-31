import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Bell } from "lucide-react";

const NotificationsList = ({ userId }) => {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center p-4 space-y-2">
          <Bell className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-gray-400 text-sm">Feature Coming Soon</p>
          <p className="text-xs text-gray-500 text-center">Stay tuned for exciting notification features!</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default NotificationsList;