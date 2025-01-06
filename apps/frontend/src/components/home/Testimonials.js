import React from 'react';
import { Card, CardBody, Avatar } from "@nextui-org/react";

const TESTIMONIALS = [
  { 
    id: 'testimonial-1',
    name: "John Doe", 
    avatar: "assets/home/testimonials1.avif", 
    text: "This platform has made my university experience so much better! I've made friends from all over the world" 
  },
  { 
    id: 'testimonial-2',
    name: "Jane Smith", 
    avatar: "assets/home/testimonials2.avif", 
    text: "The blog feature helped me share my experiences and connect with others who have similar interests" 
  },
  { 
    id: 'testimonial-3',
    name: "Raymond Ndlovu", 
    avatar: "assets/home/testimonials3.avif", 
    text: "The events feature is amazing! I've attended several campus activities and made great friends through it" 
  },
  { 
    id: 'testimonial-4',
    name: "Emily Brown", 
    avatar: "assets/home/testimonials4.avif", 
    text: "Through the events platform, I discovered amazing campus activities that made my university life more exciting" 
  },
];

const TestimonialCard = ({ testimonial }) => {
  const { name, avatar, text } = testimonial;

  return (
    <Card className="bg-black text-white border-black border-2">
      <CardBody>
        <div className="flex items-center mb-4">
          <Avatar src={avatar} size="lg" />
          <p className="ml-4 font-semibold">{name}</p>
        </div>
        <p className="text-sm">{text}</p>
      </CardBody>
    </Card>
  );
};

const Testimonials = () => {
  return (
    <div className="bg-gradient-to-r from-black to-purple-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          What Our Users Say?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;