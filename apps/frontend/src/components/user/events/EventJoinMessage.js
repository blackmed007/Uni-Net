import React from 'react';
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const EventJoinMessage = ({ message, isVisible, onClose }) => {
  if (!message) return null;

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

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className={`
              bg-gradient-to-b ${styles.bgGradient}
              rounded-xl
              overflow-hidden
              shadow-2xl
              backdrop-blur-md
            `}>
              {/* Accent gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${styles.accentGradient} opacity-10`} />
              
              {/* Content */}
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
                    onPress={onClose}
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