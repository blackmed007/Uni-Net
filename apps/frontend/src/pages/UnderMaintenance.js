import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { 
  Wrench, 
  Mail, 
  RefreshCcw, 
  Settings, 
  Code, 
  Database 
} from "lucide-react";

// Tool icons that rotate to show maintenance work in progress
const TOOLS = [Wrench, Settings, Code, Database];
const TOOL_ROTATION_INTERVAL = 3000;

// Configuration for the maintenance countdown timer
const INITIAL_COUNTDOWN = {
  hours: 2,
  minutes: 0,
  seconds: 0
};

const SOCIAL_LINKS = [
  { id: 'twitter', name: 'Twitter' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' }
];

const MOTION_VARIANTS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  toolIcon: (currentTool, index) => ({
    animate: {
      scale: currentTool === index ? 1 : 0.5,
      opacity: currentTool === index ? 1 : 0,
      rotate: [0, 10, -10, 0],
    },
    transition: {
      scale: { duration: 0.3 },
      opacity: { duration: 0.3 },
      rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  })
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

const MaintenanceTimer = ({ timeLeft }) => {
  const formatTime = (value) => value.toString().padStart(2, '0');

  return (
    <motion.div
      className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <motion.div
          key={unit}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="text-4xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            {formatTime(value)}
          </motion.div>
          <div className="text-sm text-gray-400 capitalize">{unit}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SocialLinks = () => (
  <motion.div
    className="text-sm text-gray-400"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
  >
    <p className="mb-4">Stay updated on our progress</p>
    <div className="flex justify-center gap-6">
      {SOCIAL_LINKS.map(({ id, name }, index) => (
        <motion.a
          key={id}
          href="#"
          className="hover:text-purple-400 transition-colors relative group"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + index * 0.1 }}
        >
          <span>{name}</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
        </motion.a>
      ))}
    </div>
  </motion.div>
);

const MaintenanceIcon = ({ Tool, currentTool, index }) => (
  <motion.div
    key={index}
    className="absolute"
    animate={MOTION_VARIANTS.toolIcon(currentTool, index).animate}
    transition={MOTION_VARIANTS.toolIcon(currentTool, index).transition}
  >
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-full blur-lg" />
      <Tool size={64} className="text-purple-500 relative z-10" />
    </div>
  </motion.div>
);

const UnderMaintenance = () => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN);
  const [currentTool, setCurrentTool] = useState(0);

  // Timer effect: Calculates and updates the remaining maintenance time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        // Convert total seconds back to hours, minutes, seconds

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const toolInterval = setInterval(() => {
      setCurrentTool(prev => (prev + 1) % TOOLS.length);
    }, TOOL_ROTATION_INTERVAL);

    return () => clearInterval(toolInterval);
  }, []);

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@uniconnect.com';
  };

  const handleCheckAgain = () => {
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
        {...MOTION_VARIANTS.container}
        className="relative z-10 text-center space-y-8 max-w-2xl"
      >
        <div className="relative h-32 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {TOOLS.map((Tool, index) => (
              <MaintenanceIcon 
                key={index}
                Tool={Tool}
                currentTool={currentTool}
                index={index}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-red-500">
            Under Maintenance
          </h1>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xl text-gray-300">
              We're making UniConnect even better! Our team is working on exciting new features and improvements.
            </p>
          </motion.div>

          <MaintenanceTimer timeLeft={timeLeft} />
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            color="primary"
            variant="shadow"
            startContent={<Mail size={18} />}
            className="bg-gradient-to-r from-purple-600 to-red-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            onClick={handleContactSupport}
          >
            Contact Support
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            startContent={<RefreshCcw size={18} />}
            onClick={handleCheckAgain}
            className="hover:bg-white/5 transition-colors duration-300"
          >
            Check Again
          </Button>
        </motion.div>

        <SocialLinks />
      </motion.div>
    </div>
  );
};

export default UnderMaintenance;