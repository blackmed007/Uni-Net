import React, { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button 
} from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

const UserConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getActionDetails = () => {
    switch (actionType) {
      case 'suspend':
        return {
          title: "Suspend User",
          message: "Are you sure you want to suspend this user? They will not be able to access the platform until reactivated.",
          confirmText: "Suspend User",
          confirmColor: "warning",
          icon: "warning"
        };
      case 'activate':
        return {
          title: "Activate User",
          message: "Are you sure you want to activate this user? They will regain access to the platform.",
          confirmText: "Activate User",
          confirmColor: "success",
          icon: "success"
        };
      case 'delete':
        return {
          title: "Delete User",
          message: "Are you sure you want to permanently delete this user? This action cannot be undone.",
          confirmText: "Delete User",
          confirmColor: "danger",
          icon: "danger"
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "primary",
          icon: "primary"
        };
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onConfirm();
      onClose();
    } catch (error) {
      setError(error.message || 'An error occurred while performing this action.');
    } finally {
      setIsLoading(false);
    }
  };

  const { title, message, confirmText, confirmColor, icon } = getActionDetails();

  const getIconColor = () => {
    switch (icon) {
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

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
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className={getIconColor()} />
            <span className="text-xl font-bold">{title}</span>
          </div>
        </ModalHeader>
        
        <ModalBody>
          {error && (
            <div className="bg-danger bg-opacity-10 border border-danger text-danger rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          <p className="text-gray-300">{message}</p>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="flat" 
            onPress={onClose}
            className="bg-gray-800 text-white"
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color={confirmColor}
            onPress={handleConfirm}
            isLoading={isLoading}
            className={`bg-${confirmColor}`}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserConfirmActionModal;