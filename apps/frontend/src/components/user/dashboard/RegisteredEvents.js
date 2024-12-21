import React from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Calendar } from "lucide-react";

const RegisteredEvents = ({ events }) => {
  const handleViewDetails = (eventId) => {
    console.log(`View details for event ${eventId}`);
  };

  // Only show the last 3 events
  const recentEvents = events.slice(-3);

  return (
    <Card>
      <CardBody>
        {recentEvents.length === 0 ? (
          <div className="p-4">You haven't registered for any events yet</div>
        ) : (
          <div className="space-y-4">
            {recentEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-black dark:text-white">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.date} - {event.time}</p>
                  </div>
                </div>
                <Button size="sm" color="primary" variant="light" onPress={() => handleViewDetails(event.id)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RegisteredEvents;