import React from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";

const Error = ({ status }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getErrorMessage = () => {
    // Check if status is passed as prop
    const errorStatus = status || 404;

    switch (errorStatus) {
      case 404:
        return "The page you're looking for doesn't exist.";
      case 403:
        return "You don't have permission to access this page.";
      case 500:
        return "Something went wrong on our end.";
      default:
        return "An unexpected error occurred.";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto"
        >
          <AlertTriangle size={64} className="mx-auto text-red-500" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oops!
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getErrorMessage()}
          </motion.p>

          {status && (
            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Error Code: {status}
            </motion.p>
          )}
        </div>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            color="primary"
            variant="shadow"
            startContent={<Home size={18} />}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            startContent={<RefreshCcw size={18} />}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;