import React from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Users } from "lucide-react";

const JoinedStudyGroups = ({ groups }) => {
  const handleViewDetails = (groupId) => {
    console.log(`View details for group ${groupId}`);
  };

  return (
    <Card>
      <CardBody>
        {groups.length === 0 ? (
          <div className="p-4">You haven't joined any study groups yet</div>
        ) : (
          <div className="space-y-4">
            {groups.map(group => (
              <div key={group.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                <div className="flex items-center space-x-2">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="font-medium text-black dark:text-white">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.subject}</p>
                  </div>
                </div>
                <Button size="sm" color="primary" variant="light" onPress={() => handleViewDetails(group.id)}>
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

export default JoinedStudyGroups;