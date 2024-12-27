import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Image } from "@nextui-org/react";

// Content for the typing animation sequence
const STORY_PARAGRAPHS = [
  "We started this project because we believe that every international student deserves to have an amazing university experience.",
  "Our team of former international students knows firsthand the challenges of adapting to a new culture and academic environment.",
  "Our mission is to create a platform that connects students, fosters cultural exchange, and makes the transition to university life smoother and more enjoyable for everyone."
];

const TYPING_SPEED = 40;
const PARAGRAPH_DELAY = 1000;

const OurStory = () => {
    // Tracks which paragraph is currently being displayed
  const [currentParagraph, setCurrentParagraph] = useState(0);
    // Tracks the current character position in the typing animation
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    // Flag to handle component unmounting and prevent memory leaks
    let isMounted = true;

    const animateText = async () => {
      for (let paragraphIndex = 0; paragraphIndex < STORY_PARAGRAPHS.length; paragraphIndex++) {
        if (!isMounted) break;

        setCurrentParagraph(paragraphIndex);
        setCurrentCharIndex(0);

        const text = STORY_PARAGRAPHS[paragraphIndex];
        
        // Type out each character
        for (let charIndex = 0; charIndex <= text.length; charIndex++) {
          if (!isMounted) break;
          
          setCurrentCharIndex(charIndex);
          await new Promise(resolve => setTimeout(resolve, TYPING_SPEED));
        }

        // Delay before next paragraph
        if (isMounted && paragraphIndex < STORY_PARAGRAPHS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, PARAGRAPH_DELAY));
        }
      }
    };

    animateText();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderParagraph = (text, index) => {
    if (index > currentParagraph) return null;
    if (index < currentParagraph) return text;

    return text.split("").map((char, charIndex) => (
      <motion.span
        key={charIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: charIndex <= currentCharIndex ? 1 : 0 }}
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <section id="our-story" className="bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Story</h2>
        <Card className="bg-black">
          <CardBody className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image 
                src="assets/home/ourstory.avif" 
                alt="Our Team" 
                className="w-full h-auto rounded-lg shadow-lg" 
              />
            </div>
            <motion.div 
              className="md:w-1/2 md:pl-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                {STORY_PARAGRAPHS.map((paragraph, index) => (
                  <motion.p 
                    key={index} 
                    className="text-xl text-white leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index <= currentParagraph ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {renderParagraph(paragraph, index)}
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