import React from 'react';
import { Button } from "@nextui-org/react";

const Hero = () => {
    const handleGetStarted = () => {
        // Add your logic here for what should happen when the button is clicked
        console.log("Get Started button clicked");
        // For example, you could redirect to a sign-up page:
        window.location.href = "/signup";
      };
  return (
    <div className="relative bg-gradient-to-r from-black to-magenta-900 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Making Your University Life Experience Better
          </h1>
          <p className="text-xl mb-8">
            Blend in and experience new cultures as an international student
          </p>
          <Button 
            color="primary"
            size="lg"
            onClick={handleGetStarted}
            auto
            shadow
            animated
          >
            Get Started
          </Button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
    <img 
        src="https://plus.unsplash.com/premium_vector-1682303288962-7fb57d457004?q=80&w=2608&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        alt="Hero Illustration" 
        className="w-full h-auto rounded-xl" 
    />
</div>

      </div>
     <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 pointer-events-none"></div>

    </div>
  );
};

export default Hero;