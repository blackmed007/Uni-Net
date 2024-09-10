import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const actionText = actionType === 'cancel' ? 'cancel' : 'delete';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
          Confirm {actionType === 'cancel' ? 'Cancellation' : 'Deletion'}
        </ModalHeader>
        <ModalBody>
          <p className="text-black dark:text-white">
            Are you sure you want to {actionText} this event? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            No, Keep It
          </Button>
          <Button color={actionType === 'cancel' ? 'warning' : 'danger'} onPress={onConfirm}>
            Yes, {actionType === 'cancel' ? 'Cancel' : 'Delete'} It
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmActionModal;