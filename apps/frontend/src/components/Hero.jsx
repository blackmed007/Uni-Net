import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col items-center text-center animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 animate-slide-up">Welcome to UniNet</h2>
        <p className="text-lg text-gray-400 mb-8 animate-slide-up animate-delay-200">
          Connect with fellow students, find events, and create a network that will help you both during and after your university life.
        </p>
        <div className="flex animate-slide-up animate-delay-400">
          <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition-colors duration-300">
            Join Now
          </Link>
          <Link to="/learn-more" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;