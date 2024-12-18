import React from 'react';
import { Card, CardBody, Image } from "@nextui-org/react";
import { motion } from 'framer-motion';

const features = [
  { 
    title: "Events", 
    icon: "assets/home/Features-Events.avif", 
    description: "Discover and join exciting campus events",
    comingSoon: false
  },
  { 
    title: "Study Groups", 
    icon: "assets/home/Features-Study Groups .avif", 
    description: "Connect with peers for collaborative learning",
    comingSoon: true
  },
  { 
    title: "Blog", 
    icon: "assets/home/Features-Blog .avif", 
    description: "Share your experiences and read others'",
    comingSoon: false
  },
  { 
    title: "Language Exchange", // Changed from "Exchange Language" for better readability
    icon: "assets/home/Features-Language Exchange .avif", 
    description: "Practice languages with native speakers",
    comingSoon: true
  },
];

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    className="flex flex-col h-full"
  >
    <Card className="bg-black-900 h-full">
      <CardBody className="flex flex-col items-center p-6 h-full">
        <motion.div 
          animate={{ y: [0, -8, 0] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-20"
          style={{ width: '164px', height: '64px' }}
        >
          <Image
            src={feature.icon}
            alt={feature.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </motion.div>
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col items-center gap-2 mb-4">
            <h3 className="text-xl font-semibold text-white text-center">{feature.title}</h3>
            {feature.comingSoon && (
              <span className="text-gray-400 text-xs bg-gray-800/50 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
          <p className="text-center text-white text-sm">{feature.description}</p>
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

const FeaturesOverview = () => {
  return (
    <div className="bg-black py-8">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8 text-white"
        >
          Features
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Feature list">
          {features.map((feature, index) => (
            <div key={feature.title} role="listitem">
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesOverview;