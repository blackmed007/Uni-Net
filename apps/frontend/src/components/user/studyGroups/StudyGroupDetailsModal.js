import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { BookOpen, School, Users, User, MessageSquare } from "lucide-react";

const StudyGroupDetailsModal = ({ group, isOpen, onClose, onJoin, isJoined }) => {
  if (!group) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{group.name}</h2>
          <Chip color="primary" variant="flat">{group.subject}</Chip>
        </ModalHeader>
        <ModalBody>
          <Tabs aria-label="Study Group Details">
            <Tab key="details" title="Details">
              <Card>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 text-primary" size={20} />
                      <div>
                        <p className="text-small font-semibold">Subject</p>
                        <p className="text-small text-default-500">{group.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <School className="mr-2 text-primary" size={20} />
                      <div>
                        <p className="text-small font-semibold">University</p>
                        <p className="text-small text-default-500">{group.university}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 text-primary" size={20} />
                      <div>
                        <p className="text-small font-semibold">Members</p>
                        <p className="text-small text-default-500">{group.members.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-2 text-primary" size={20} />
                      <div>
                        <p className="text-small font-semibold">Created By</p>
                        <p className="text-small text-default-500">{group.createdBy}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-small text-default-600">{group.description}</p>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="members" title="Members">
              <Card>
                <CardBody>
                  <ul className="space-y-2">
                    {group.members.map((member, index) => (
                      <li key={index} className="flex items-center">
                        <User className="mr-2 text-default-500" size={16} />
                        <span className="text-small text-default-600">{member}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="discussions" title="Discussions">
              <Card>
                <CardBody>
                  <div className="space-y-4">
                    {group.discussions && group.discussions.map((discussion, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="flex items-center mb-1">
                          <User className="mr-2 text-default-500" size={16} />
                          <span className="text-small font-semibold">{discussion.author}</span>
                          <span className="text-tiny text-default-400 ml-2">{discussion.date}</span>
                        </div>
                        <p className="text-small text-default-600">{discussion.content}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudyGroupDetailsModal;