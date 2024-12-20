import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Mail, 
  RefreshCcw, 
  Settings, 
  Code, 
  Database 
} from "lucide-react";

const UnderMaintenance = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value) => value.toString().padStart(2, '0');

  const tools = [Wrench, Settings, Code, Database];
  const [currentTool, setCurrentTool] = useState(0);

  useEffect(() => {
    const toolInterval = setInterval(() => {
      setCurrentTool(prev => (prev + 1) % tools.length);
    }, 3000);

    return () => clearInterval(toolInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
      
      {/* Floating elements */}
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center space-y-8 max-w-2xl"
      >
        {/* Animated icon section */}
        <div className="relative h-32 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="absolute"
                animate={{
                  scale: currentTool === index ? 1 : 0.5,
                  opacity: currentTool === index ? 1 : 0,
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  scale: { duration: 0.3 },
                  opacity: { duration: 0.3 },
                  rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-full blur-lg" />
                  {React.createElement(tools[index], { 
                    size: 64, 
                    className: "text-purple-500 relative z-10" 
                  })}
                </div>
              </motion.div>
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
            onClick={() => window.location.href = 'mailto:support@uniconnect.com'}
          >
            Contact Support
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            startContent={<RefreshCcw size={18} />}
            onClick={() => window.location.reload()}
            className="hover:bg-white/5 transition-colors duration-300"
          >
            Check Again
          </Button>
        </motion.div>

        <motion.div
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="mb-4">Stay updated on our progress</p>
          <div className="flex justify-center gap-6">
            {['Twitter', 'Facebook', 'Instagram'].map((social, index) => (
              <motion.a
                key={social}
                href="#"
                className="hover:text-purple-400 transition-colors relative group"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <span>{social}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnderMaintenance;