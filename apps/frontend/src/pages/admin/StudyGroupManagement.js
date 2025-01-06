import React from 'react';
import { motion } from "framer-motion";

const StudyGroupManagement = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      
      {/* Coming soon content */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center text-white z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
      >
        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Coming Soon
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-md">
          Study Group Management features are currently under development. 
          Check back later for exciting new features!
        </p>
        
        {/* Optional: Add a decorative element */}
        <motion.div
          className="mt-8 text-8xl opacity-25"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          👥
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudyGroupManagement;