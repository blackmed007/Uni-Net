import React from 'react';
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const features = [
  { title: "Events", icon: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Discover and join exciting campus events" },
  { title: "Study Groups", icon: "https://plus.unsplash.com/premium_vector-1720951733734-ab79b62106a0?q=80&w=2766&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Connect with peers for collaborative learning" },
  { title: "Blog", icon: "https://plus.unsplash.com/premium_vector-1724125271400-1a4647e26389?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Share your experiences and read others'" },
  { title: "Exchange Language", icon: "https://plus.unsplash.com/premium_vector-1721386087356-acd48d98a155?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Practice languages with native speakers" },
];

const FeaturesOverview = () => {
  return (
    <div className="bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <br></br>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black-900">
              <CardBody className="items-center">
              
              <div style={{ width: '164px', height: '64px' }}>
  <Image
    src={feature.icon}
    alt={feature.title}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Adjust objectFit as needed
  />
</div>



<br></br><br></br>
                <br></br>
                <h3 className="text-xl font-semibold mt-4 text-white">{feature.title}</h3>
                <p className="text-center mt-2 text-white">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesOverview;