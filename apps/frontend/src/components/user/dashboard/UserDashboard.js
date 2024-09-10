import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

const UserDashboard = ({ 
  user, 
  studyGroups, 
  events, 
  NotificationsList, 
  JoinedStudyGroups, 
  RegisteredEvents, 
  RecentActivity 
}) => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(`user_${user.id}_hasVisited`);
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem(`user_${user.id}_hasVisited`, 'true');
    }
  }, [user.id]);

  const joinedGroups = studyGroups.filter(group => 
    Array.isArray(group.members) && group.members.includes(user.id)
  );

  const registeredEvents = events.filter(event => 
    Array.isArray(event.participants) && event.participants.includes(user.id)
  );

  return (
    <div className="space-y-6">
      {isFirstVisit && (
        <Card className="bg-green-100 dark:bg-green-800">
          <CardBody>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-100">Welcome, {user.firstName}!</h2>
            <p className="text-green-700 dark:text-green-200">We're excited to have you join UniConnect. Start exploring and connecting with your peers!</p>
          </CardBody>
        </Card>
      )}
      <h1 className="text-4xl font-bold">Your Dashboard</h1>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 mb-6">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Notifications</h2>
            </CardHeader>
            <CardBody>
              <NotificationsList userId={user.id} />
            </CardBody>
          </Card>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Joined Study Groups</h2>
            </CardHeader>
            <CardBody>
              <JoinedStudyGroups groups={joinedGroups} />
            </CardBody>
          </Card>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Registered Events</h2>
            </CardHeader>
            <CardBody>
              <RegisteredEvents events={registeredEvents} />
            </CardBody>
          </Card>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
            </CardHeader>
            <CardBody>
              <RecentActivity userId={user.id} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;