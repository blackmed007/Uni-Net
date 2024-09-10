import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, User, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Calendar, MapPin, Briefcase, Users, BookOpen, Activity } from "lucide-react";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!user) return null;

  const mockActivityLog = [
    { action: "Logged in", timestamp: "2023-09-05 14:30" },
    { action: "Updated profile picture", timestamp: "2023-09-04 10:15" },
    { action: "Joined study group 'Advanced Mathematics'", timestamp: "2023-09-03 16:45" },
  ];

  const mockAssociatedEvents = [
    { name: "Web Development Workshop", date: "2023-09-10", status: "Upcoming" },
    { name: "Data Science Seminar", date: "2023-08-28", status: "Attended" },
  ];

  const mockStudyGroups = [
    { name: "Advanced Mathematics", members: 15, role: "Member" },
    { name: "Python Programming", members: 20, role: "Admin" },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="3xl" 
      scrollBehavior="inside"
      classNames={{
        base: "bg-background text-foreground",
        header: "border-b border-default-200",
        body: "py-6",
        footer: "border-t border-default-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <User
            avatarProps={{ radius: "lg", size: "lg", src: `https://i.pravatar.cc/150?u=${user.id}` }}
            name={user.name}
            description={user.email}
            classNames={{
              name: "text-foreground",
              description: "text-default-500",
            }}
          />
        </ModalHeader>
        <ModalBody>
          <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab}>
            <Tab key="info" title="User Info">
              <Card>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-default-500">Role</p>
                        <p className="font-medium text-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-default-500">Registration Date</p>
                        <p className="font-medium text-foreground">{user.registrationDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-default-500">Gender</p>
                        <p className="font-medium text-foreground">{user.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-default-500">Location</p>
                        <p className="font-medium text-foreground">{user.university}, {user.city}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="activity" title="Activity Log">
              <Card>
                <CardBody>
                  <ul className="space-y-2">
                    {mockActivityLog.map((activity, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm text-foreground">{activity.action}</span>
                        <span className="text-xs text-default-500">{activity.timestamp}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="events" title="Events">
              <Card>
                <CardBody>
                  <ul className="space-y-2">
                    {mockAssociatedEvents.map((event, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm text-foreground">{event.name}</span>
                        <span className="text-xs text-default-500">{event.date} ({event.status})</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="groups" title="Study Groups">
              <Card>
                <CardBody>
                  <ul className="space-y-2">
                    {mockStudyGroups.map((group, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm text-foreground">{group.name}</span>
                        <span className="text-xs text-default-500">{group.members} members (Role: {group.role})</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => console.log("Edit user")}>
            Edit User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserDetailModal;