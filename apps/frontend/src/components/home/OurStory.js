import React from 'react';
import { Card, CardBody, Image } from "@nextui-org/react";

const OurStory = () => {
  return (
    <div className="bg-black-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
        <Card className="bg-black">
          <CardBody className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image src="https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Our Team" className="w-full h-auto" />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <p className="text-lg mb-4 text-white">
                We started this project because we believe that every international student deserves to have an amazing university experience. Our team of former international students knows firsthand the challenges of adapting to a new culture and academic environment.
              </p>
              <p className="text-lg text-white">
                Our mission is to create a platform that connects students, fosters cultural exchange, and makes the transition to university life smoother and more enjoyable for everyone.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default OurStory;