import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card, CardBody, Image } from "@nextui-org/react";

const OurStory = () => {
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const controls = useAnimation();

  const paragraphs = [
    "We started this project because we believe that every international student deserves to have an amazing university experience.",
    "Our team of former international students knows firsthand the challenges of adapting to a new culture and academic environment.",
    "Our mission is to create a platform that connects students, fosters cultural exchange, and makes the transition to university life smoother and more enjoyable for everyone."
  ];

  useEffect(() => {
    const animateParagraphs = async () => {
      for (let i = 0; i < paragraphs.length; i++) {
        setCurrentParagraph(i);
        setCurrentCharIndex(0);
        await new Promise(resolve => {
          const interval = setInterval(() => {
            setCurrentCharIndex(prev => {
              if (prev < paragraphs[i].length - 1) {
                return prev + 1;
              } else {
                clearInterval(interval);
                resolve();
                return prev;
              }
            });
          }, 40);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    animateParagraphs();
  }, []);

  return (
    <section id="our-story" className="bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Story</h2>
        <Card className="bg-black">
          <CardBody className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image src="assets/home/ourstory.avif" alt="Our Team" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <motion.div 
              className="md:w-1/2 md:pl-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <motion.p 
                    key={index} 
                    className="text-xl text-white leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index <= currentParagraph ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {index === currentParagraph ? (
                      paragraph.split("").map((char, charIndex) => (
                        <motion.span
                          key={charIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: charIndex <= currentCharIndex ? 1 : 0 }}
                        >
                          {char}
                        </motion.span>
                      ))
                    ) : index < currentParagraph ? (
                      paragraph
                    ) : null}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default OurStory;