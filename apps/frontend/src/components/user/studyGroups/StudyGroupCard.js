import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from "@nextui-org/react";
import { BookOpen, Users, School } from "lucide-react";

const StudyGroupCard = ({ group, onViewDetails, onJoin, isJoined }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex-col items-start">
        <h4 className="text-lg font-bold">{group.name}</h4>
        <Chip color="primary" variant="flat" size="sm">{group.subject}</Chip>
      </CardHeader>
      <CardBody>
        <div className="flex items-center mb-2">
          <BookOpen className="mr-2 text-default-500" size={16} />
          <span className="text-small text-default-600">{group.subject}</span>
        </div>
        <div className="flex items-center mb-2">
          <School className="mr-2 text-default-500" size={16} />
          <span className="text-small text-default-600">{group.university}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-2 text-default-500" size={16} />
          <span className="text-small text-default-600">{group.members.length} members</span>
        </div>
      </CardBody>
      <CardFooter className="justify-between">
        <Button color="primary" variant="flat" onPress={onViewDetails}>
          View Details
        </Button>
        {isJoined ? (
          <Button color="success" variant="flat" disabled>
            Joined
          </Button>
        ) : (
          <Button color="primary" onPress={onJoin}>
            Join Group
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudyGroupCard;