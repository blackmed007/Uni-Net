import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

const BlogConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const getActionDetails = () => {
    switch (actionType) {
      case 'delete':
        return {
          title: "Delete Blog Post",
          message: "Are you sure you want to permanently delete this blog post? This action cannot be undone.",
          confirmText: "Delete Post",
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

export default BlogConfirmActionModal;