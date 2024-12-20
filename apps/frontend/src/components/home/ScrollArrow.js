import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
/**
 * @component ScrollArrow
 * @description Smooth scroll Arrow when clicked it takes you to the next part of the page 
 */

const ScrollArrow = ({ onClick }) => {
  return (
    <motion.div 
      className="flex justify-center cursor-pointer"
      onClick={onClick}
      animate={{ y: [0, 10, 0] }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5,
        ease: "easeInOut"
      }}
    >
      <ChevronDown size={32} color="white" />
    </motion.div>
  );
};

export default ScrollArrow;