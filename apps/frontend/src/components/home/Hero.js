import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from 'framer-motion';

// Headlines that rotate in the hero section
const HEADLINES = [
  "Making Your University Life Experience Better",
  "Connecting Students Across Campuses Worldwide",
  "Empowering Global Education Communities",
  "Bridging Cultures in Higher Education"
];

const HEADLINE_ROTATION_INTERVAL = 5000;

const Hero = () => {
    // Controls the automatic rotation of headlines
  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(handleHeadlineRotation, HEADLINE_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);
  // Cycles through headlines with smooth transitions
  const handleHeadlineRotation = () => {
    setCurrentHeadline((prev) => (prev + 1) % HEADLINES.length);
  };

  const handleGetStarted = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="relative bg-gradient-to-r from-black to-purple-900 py-32 overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          backgroundImage: 'url("path/to/subtle-pattern.png")',
          opacity: 0.1
        }}
      />
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
        <div className="md:w-1/2 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentHeadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
            >
              {HEADLINES[currentHeadline]}
            </motion.h1>
          </AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl mb-10 text-gray-300"
          >
            Blend in and experience new cultures as an international student
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              color="primary"
              size="lg"
              onClick={handleGetStarted}
              auto
              shadow
              animated
            >
              Get Started
            </Button>
          </motion.div>
        </div>
        <motion.div 
          className="md:w-1/2 mt-12 md:mt-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        >
          <img 
            src="assets/home/hero-illustration.avif" 
            alt="Hero Illustration" 
            className="w-full h-auto rounded-xl shadow-2xl" 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;