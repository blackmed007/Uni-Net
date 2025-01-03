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

const MOTION_VARIANTS = {
  section: {
    hidden: { opacity: 0.5, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }
};

const Section = ({ id, children, className = '' }) => (
  <motion.section
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={MOTION_VARIANTS.section}
    className={`my-24 ${className}`}
  >
    {children}
  </motion.section>
);

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const handleFeaturesScroll = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main>
        <div className="relative">
          <Hero />
          <div className="absolute bottom-8 left-0 right-0">
            <ScrollArrow onClick={handleFeaturesScroll} />
          </div>
        </div>

        <Section id="features" aria-label="Features Overview">
          <FeaturesOverview />
        </Section>

        <Section aria-label="Our Story">
          <OurStory />
        </Section>

        <Section aria-label="Testimonials">
          <Testimonials />
        </Section>

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