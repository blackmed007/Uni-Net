import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import FeaturesOverview from '../components/home/FeaturesOverview';
import OurStory from '../components/home/OurStory';
import Testimonials from '../components/home/Testimonials';
import Universities from '../components/home/Universities';
import Footer from '../components/home/Footer';
import ScrollArrow from '../components/home/ScrollArrow';

// Animation variants for section transitions
const sectionVariants = {
  hidden: { opacity: 50, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Function to scroll to the features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <div className="relative">
          <Hero />
          <div className="absolute bottom-8 left-0 right-0">
            <ScrollArrow onClick={scrollToFeatures} />
          </div>
        </div>

        <motion.section
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="my-24"
          aria-label="Features Overview"
        >
          <FeaturesOverview />
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="my-24"
          aria-label="Our Story"
        >
          <OurStory />
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="my-24"
          aria-label="Testimonials"
        >
          <Testimonials />
        </motion.section>

        <motion.section
          style={{ scale }}
          className="my-24"
          aria-label="Participating Universities"
        >
          <Universities />
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;