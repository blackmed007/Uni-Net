import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const EventJoinMessage = ({ message, isVisible, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Lock scroll when modal is visible
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Reset scroll lock
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isVisible]);

  if (!mounted || !message) return null;

  const getMessageType = () => {
    if (message.includes("successfully")) return "success";
    if (message.includes("Sorry")) return "error";
    return "info";
  };

  const getMessageStyles = () => {
    const type = getMessageType();
    switch (type) {
      case "success":
        return {
          bgGradient: "from-black to-green-950/50",
          accentGradient: "from-green-500/20 to-emerald-500/20",
          icon: <CheckCircle2 size={24} className="text-green-400" />,
        };
      case "error":
        return {
          bgGradient: "from-black to-red-950/50",
          accentGradient: "from-red-500/20 to-pink-500/20",
          icon: <XCircle size={24} className="text-red-400" />,
        };
      default:
        return {
          bgGradient: "from-black to-blue-950/50",
          accentGradient: "from-blue-500/20 to-purple-500/20",
          icon: <AlertCircle size={24} className="text-blue-400" />,
        };
    }
  };

  const styles = getMessageStyles();

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div 
          className="fixed inset-0 z-[1000]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={handleContentClick}
          >
            <div 
              className={`
                bg-gradient-to-b ${styles.bgGradient}
                rounded-xl
                overflow-hidden
                shadow-2xl
                backdrop-blur-md
                relative
              `}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${styles.accentGradient} opacity-10`} />
              
              <div className="relative p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-base font-medium leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    className="
                      bg-white/10
                      hover:bg-white/20
                      text-white
                      font-medium
                      transition-colors
                      duration-200
                      min-w-[80px]
                      px-4
                    "
                    onPress={handleCloseClick}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventJoinMessage;