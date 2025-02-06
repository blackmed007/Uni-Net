import React from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, RefreshCcw } from "lucide-react";

const ERROR_MESSAGES = {
  400: "The request was invalid. Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to access this area. This section is restricted to authorized personnel only.",
  404: "Oops! We couldn't find what you're looking for. This page doesn't exist or may have been moved.",
  422: "Unable to process your request. Please check your input.",
  500: "Something went wrong on our end. Our team has been notified and is working on it.",
  network: "Unable to connect to the server. Please check your internet connection and try again.",
  default: "An unexpected error occurred. Please try again or contact support if the problem persists."
};

const ERROR_TITLES = {
  400: "Invalid Request",
  401: "Session Expired",
  403: "Access Restricted",
  404: "Page Not Found",
  422: "Invalid Input",
  500: "Server Error",
  network: "Connection Error",
  default: "Oops!"
};

const getErrorMessage = (code, message) => {
  // Special case for 403 with specific message
  if (code === '403' && message?.includes('admin')) {
    return "This area is restricted to administrators only. Please contact your system administrator if you believe this is a mistake.";
  }

  // If we have a custom message that's not a default one, use it
  if (message && 
      message !== "Internal server error" && 
      message !== "null" && 
      message !== "undefined") {
    return decodeURIComponent(message);
  }

  // Otherwise use our predefined messages
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.default;
};

const getErrorTitle = (code) => {
  return ERROR_TITLES[code] || ERROR_TITLES.default;
};

const MOTION_VARIANTS = {
  iconVariants: {
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
  },
  containerVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }
};

const BackgroundParticle = ({ index }) => (
  <motion.div
    key={index}
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
);

const getSuggestedAction = (code) => {
  switch (code) {
    case '403':
      return "Return to your dashboard or contact support if you need access to this area.";
    case '404':
      return "Check the URL or use the navigation menu to find what you're looking for.";
    case 'network':
      return "Check your internet connection and try again in a few moments.";
    case '500':
      return "Please try again later or contact support if the problem persists.";
    default:
      return null;
  }
};

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get('code') || '404'; // Default to 404 if no code provided
  const message = params.get('message');
  
  const handleHomeClick = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const role = userData.role?.toLowerCase();
    
    if (role === "admin") {
      navigate('/admin/dashboard');
    } else if (role === "user") {
      navigate('/user/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleRetryClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.reload();
    }
  };

  const suggestedAction = getSuggestedAction(status);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
      
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <BackgroundParticle key={i} index={i} />
        ))}
      </div>
      
      <motion.div
        variants={MOTION_VARIANTS.containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center space-y-8 max-w-lg mx-4"
      >
        <motion.div
          variants={MOTION_VARIANTS.iconVariants}
          className="relative z-10 mx-auto w-32 h-32 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="text-8xl font-bold">
            !
          </div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          variants={MOTION_VARIANTS.containerVariants}
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
              {getErrorTitle(status)}
            </h1>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            variants={MOTION_VARIANTS.containerVariants}
          >
            <p className="text-xl text-gray-300">
              {getErrorMessage(status, message)}
            </p>
            {suggestedAction && (
              <p className="mt-4 text-sm text-gray-400">
                {suggestedAction}
              </p>
            )}
            {status && (
              <div className="mt-4 inline-block px-4 py-2 bg-white/5 rounded-full">
                <span className="text-gray-400">Error Code: </span>
                <span className="text-red-400 font-mono">{status}</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 flex-wrap"
          variants={MOTION_VARIANTS.containerVariants}
        >
          <Button
            color="primary"
            variant="shadow"
            startContent={<Home size={18} />}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            onClick={handleHomeClick}
          >
            Back to Dashboard
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            startContent={<RefreshCcw size={18} />}
            onClick={handleRetryClick}
            className="hover:bg-white/5 transition-colors duration-300"
          >
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;