import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

const UserConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const getActionDetails = () => {
    switch (actionType) {
      case 'suspend':
        return {
          title: "Suspend User",
          message: "Are you sure you want to suspend this user? They will not be able to access the platform until reactivated.",
          confirmText: "Suspend User",
          confirmColor: "warning"
        };
      case 'activate':
        return {
          title: "Activate User",
          message: "Are you sure you want to activate this user? They will regain access to the platform.",
          confirmText: "Activate User",
          confirmColor: "success"
        };
      case 'delete':
        return {
          title: "Delete User",
          message: "Are you sure you want to permanently delete this user? This action cannot be undone.",
          confirmText: "Delete User",
          confirmColor: "danger"
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "primary"
        };
    }
  };

  const { title, message, confirmText, confirmColor } = getActionDetails();

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
            <AlertTriangle className="mr-2 text-yellow-500" />
            {title}
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

export default UserConfirmActionModal;