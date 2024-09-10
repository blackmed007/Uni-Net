import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { BookOpen, MapPin, Users, Calendar, Tag, User } from "lucide-react";

const StudyGroupDetailModal = ({ isOpen, onClose, group }) => {
  if (!group) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{group.name}</h2>
          <p className="text-default-500">{group.subject}</p>
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Subject</p>
                    <p className="font-medium">{group.subject}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">University</p>
                    <p className="font-medium">{group.university}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Members</p>
                    <p className="font-medium">{group.members}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Created On</p>
                    <p className="font-medium">{group.createdOn}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Created By</p>
                    <p className="font-medium">{group.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Status</p>
                    <p className="font-medium">{group.status}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{group.description || 'No description available.'}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => console.log("Edit study group")}>
            Edit Study Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudyGroupDetailModal;