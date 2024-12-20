import React from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, RefreshCcw, AlertTriangle, X, CheckCircle2, Shield } from "lucide-react";

const Error = ({ status }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getErrorMessage = () => {
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 bg-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        <div className="relative">
          <motion.div
            variants={iconVariants}
            className="relative z-10 mx-auto w-32 h-32 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
            <AlertTriangle size={64} className="text-red-500" />
          </motion.div>
        </div>

        <motion.div 
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
              Oops!
            </h1>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            variants={containerVariants}
          >
            <p className="text-xl text-gray-300">
              {getErrorMessage()}
            </p>
            {status && (
              <div className="mt-4 inline-block px-4 py-2 bg-white/5 rounded-full">
                <span className="text-gray-400">Error Code: </span>
                <span className="text-red-400 font-mono">{status}</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          variants={containerVariants}
        >
          <Button
            color="primary"
            variant="shadow"
            startContent={<Home size={18} />}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            startContent={<RefreshCcw size={18} />}
            onClick={() => window.location.reload()}
            className="hover:bg-white/5 transition-colors duration-300"
          >
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;