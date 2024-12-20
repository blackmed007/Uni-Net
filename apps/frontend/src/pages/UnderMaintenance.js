import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Wrench, Clock, Mail, RefreshCcw } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="mx-auto"
        >
          <Wrench size={64} className="mx-auto text-blue-500" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Under Maintenance
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're currently upgrading our systems to serve you better.
          </motion.p>

          <motion.div
            className="flex justify-center gap-8 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{formatTime(timeLeft.hours)}</div>
              <div className="text-sm text-gray-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{formatTime(timeLeft.minutes)}</div>
              <div className="text-sm text-gray-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{formatTime(timeLeft.seconds)}</div>
              <div className="text-sm text-gray-500">Seconds</div>
            </div>
          </motion.div>

          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Expected completion: {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </motion.p>
        </div>

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
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => window.location.href = 'mailto:support@uniconnect.com'}
          >
            Contact Support
          </Button>
          
          <Button
            color="secondary"
            variant="bordered"
            startContent={<RefreshCcw size={18} />}
            onClick={() => window.location.reload()}
          >
            Check Again
          </Button>
        </motion.div>

        <motion.div
          className="text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Follow us on social media for updates
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Facebook</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Instagram</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnderMaintenance;