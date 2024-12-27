import React from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCcw } from "lucide-react";

const ERROR_MESSAGES = {
  404: "The page you're looking for doesn't exist.",
  403: "You don't have permission to access this page.",
  500: "Something went wrong on our end.",
  default: "An unexpected error occurred."
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

const ErrorPage = ({ status = 404 }) => {
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    navigate('/');
  };

  const handleRetryClick = () => {
    window.location.reload();
  };

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
        className="relative z-10 text-center space-y-8 max-w-lg"
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
              Oops!
            </h1>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            variants={MOTION_VARIANTS.containerVariants}
          >
            <p className="text-xl text-gray-300">
              {ERROR_MESSAGES[status] || ERROR_MESSAGES.default}
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
          variants={MOTION_VARIANTS.containerVariants}
        >
          <Button
            color="primary"
            variant="shadow"
            startContent={<Home size={18} />}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            onClick={handleHomeClick}
          >
            Back to Home
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