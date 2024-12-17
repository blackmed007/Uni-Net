import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const StudyGroupDetailsModal = ({ group, isOpen, onClose, onJoin, isJoined }) => {
  if (!group) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{group.name}</ModalHeader>
        <ModalBody>
          <p><strong>Subject:</strong> {group.subject}</p>
          <p><strong>University:</strong> {group.university}</p>
          <p><strong>Study Year:</strong> {group.studyYear}</p>
          <p><strong>Members:</strong> {group.members?.length || 0}</p>
          <p><strong>Description:</strong> {group.description}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color={isJoined ? "success" : "primary"} onPress={() => onJoin(group.id)}>
            {isJoined ? "Leave Group" : "Join Group"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudyGroupDetailsModal;