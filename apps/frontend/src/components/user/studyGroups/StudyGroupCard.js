import React from 'react';
import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { BookOpen, Users, School } from "lucide-react";

const StudyGroupCard = ({ group, onViewDetails, onJoin, isJoined }) => {
  return (
    <Card className="bg-black text-white overflow-hidden cursor-pointer">
      <CardBody className="p-4">
        <Chip color="primary" variant="flat" className="mb-2">{group.subject}</Chip>
        <h3 className="text-xl font-bold mb-2">{group.name}</h3>
        <p className="text-gray-300 text-sm mb-4">{group.description}</p>
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <School className="mr-2" size={16} />
          <span>{group.university}</span>
        </div>
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <BookOpen className="mr-2" size={16} />
          <span>Year {group.studyYear}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            <Users className="inline mr-1" size={16} />
            {group.members?.length || 0} members
          </span>
          <Button
            color={isJoined ? "success" : "primary"}
            onPress={() => onJoin(group.id)}
          >
            {isJoined ? "Joined" : "Join Group"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default StudyGroupCard;