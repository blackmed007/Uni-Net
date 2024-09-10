import React from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import FeaturesOverview from '../components/home/FeaturesOverview';
import OurStory from '../components/home/OurStory';
import Testimonials from '../components/home/Testimonials';
import Universities from '../components/home/Universities';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <FeaturesOverview />
        <OurStory />
        <Testimonials />
        <Universities />
      </main>
      <Footer />
    </div>
  );
};

export default Home;