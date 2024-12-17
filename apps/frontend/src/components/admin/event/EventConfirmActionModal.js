import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { AlertTriangle, XCircle, Play } from "lucide-react";

const EventConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType, eventName }) => {
  const getActionDetails = () => {
    switch (actionType) {
      case 'cancel':
        return {
          title: "Cancel Event",
          message: `Are you sure you want to cancel the event "${eventName}"? This action will notify all participants.`,
          confirmText: "Cancel Event",
          confirmColor: "warning",
          icon: <XCircle className="text-warning" size={24} />
        };
      case 'ongoing':
        return {
          title: "Make Event Ongoing",
          message: `Are you sure you want to change the status of "${eventName}" to Ongoing?`,
          confirmText: "Make Ongoing",
          confirmColor: "success",
          icon: <Play className="text-success" size={24} />
        };
      case 'delete':
        return {
          title: "Delete Event",
          message: `Are you sure you want to permanently delete the event "${eventName}"? This action cannot be undone.`,
          confirmText: "Delete Event",
          confirmColor: "danger",
          icon: <AlertTriangle className="text-danger" size={24} />
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "primary",
          icon: <AlertTriangle className="text-primary" size={24} />
        };
    }
  };

  const { title, message, confirmText, confirmColor, icon } = getActionDetails();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      classNames={{
        base: "bg-gray-900 text-white",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-2xl font-bold flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </span>
        </ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color={confirmColor} onPress={onConfirm}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventConfirmActionModal;