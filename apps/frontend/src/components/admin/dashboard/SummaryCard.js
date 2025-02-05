import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

const SummaryCard = ({ title, value, icon: Icon, color }) => {
  const [cardData, setCardData] = useState({ title, value, color });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const gradientClass = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  }[cardData.color];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        className={`bg-gradient-to-br ${gradientClass} text-white shadow-lg rounded-xl overflow-hidden border border-gray-700`}
      >
        <CardBody className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">{cardData.title}</p>
              <p className="text-3xl font-bold mt-1">{cardData.value}</p>
            </div>
            <motion.div
              className="p-4 bg-white bg-opacity-20 rounded-full"
              whileHover={{ rotate: 15 }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;

