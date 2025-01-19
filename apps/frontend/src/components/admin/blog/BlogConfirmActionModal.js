import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const BlogConfirmActionModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getActionDetails = () => {
    switch (actionType) {
      case 'delete':
        return {
          title: "Delete Blog Post",
          message: "Are you sure you want to permanently delete this blog post? This action cannot be undone.",
          confirmText: "Delete Post",
          confirmColor: "danger",
          icon: <AlertTriangle className="text-red-500" size={24} />
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "primary",
          icon: <AlertTriangle className="text-yellow-500" size={24} />
        };
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const { title, message, confirmText, confirmColor, icon } = getActionDetails();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            {icon}
            <span className="text-2xl font-bold text-white">{title}</span>
          </motion.div>
        </ModalHeader>
        <ModalBody>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-300"
          >
            {message}
          </motion.p>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="light" 
            onPress={onClose}
            isDisabled={isSubmitting}
            className="text-white"
          >
            Cancel
          </Button>
          <Button 
            color={confirmColor}
            onPress={handleConfirm}
            isDisabled={isSubmitting}
            className={`${
              confirmColor === 'danger' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } text-white`}
            startContent={isSubmitting ? <Spinner size="sm" color="white" /> : null}
          >
            {isSubmitting ? 'Processing...' : confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BlogConfirmActionModal;