import React, { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button,
  Spinner 
} from "@nextui-org/react";
import { AlertTriangle, UserX, UserCheck, Trash2 } from "lucide-react";

const UserConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType, userName = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getActionDetails = () => {
    switch (actionType) {
      case 'suspend':
        return {
          title: "Suspend User",
          message: `Are you sure you want to suspend ${userName || 'this user'}? They will not be able to access the platform until reactivated.`,
          confirmText: "Suspend User",
          confirmColor: "warning",
          icon: UserX,
          iconColor: "text-warning"
        };
      case 'activate':
        return {
          title: "Activate User",
          message: `Are you sure you want to activate ${userName || 'this user'}? They will regain access to the platform.`,
          confirmText: "Activate User",
          confirmColor: "success",
          icon: UserCheck,
          iconColor: "text-success"
        };
      case 'delete':
        return {
          title: "Delete User",
          message: `Are you sure you want to permanently delete ${userName || 'this user'}? This action cannot be undone.`,
          confirmText: "Delete User",
          confirmColor: "danger",
          icon: Trash2,
          iconColor: "text-danger"
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "primary",
          icon: AlertTriangle,
          iconColor: "text-primary"
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
      console.error('Error in confirmation action:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while performing this action.');
    } finally {
      setIsLoading(false);
    }
  };

  const { 
    title, 
    message, 
    confirmText, 
    confirmColor, 
    icon: Icon,
    iconColor 
  } = getActionDetails();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="sm"
      classNames={{
        base: "bg-slate-900 text-white dark:bg-slate-900 dark:text-white",
        header: "border-b border-slate-800",
        body: "py-6",
        footer: "border-t border-slate-800"
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
            <Icon className={iconColor} size={24} />
            <span className="text-xl font-bold">{title}</span>
          </div>
        </ModalHeader>
        
        <ModalBody>
          {error && (
            <div className="bg-danger bg-opacity-10 border border-danger text-danger rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          <p className="text-slate-300">{message}</p>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="flat" 
            onPress={onClose}
            className="bg-slate-800 text-white"
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color={confirmColor}
            onPress={handleConfirm}
            isLoading={isLoading}
            className={`bg-${confirmColor} text-white`}
          >
            {isLoading ? (
              <Spinner color="white" size="sm" />
            ) : confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserConfirmActionModal;