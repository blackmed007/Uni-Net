import React from 'react';
import { Card, CardBody, Avatar } from "@nextui-org/react";

const testimonials = [
  { name: "John Doe", avatar: "assets/home/testimonials1.avif", text: "This platform has made my university experience so much better! I've made friends from all over the world" },
  { name: "Jane Smith", avatar: "assets/home/testimonials2.avif", text: "The study groups feature helped me improve my grades and connect with classmates" },
  { name: "Raymond Ndlovu", avatar: "assets/home/testimonials3.avif", text: "I love the events section! I Brealy had any friends , if it wasn't for this website i would be still alone ): , I even became white thanks to it  " },
  { name: "Emily Brown", avatar: "assets/home/testimonials4.avif", text: "The language exchange feature is amazing. I've improved my language skills while making new friends" },
];

const Testimonials = () => {
  return (
    <div className="bg-gradient-to-r from-black to-purple-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">What Our Users Say?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black text-white border-black border-2">
              <CardBody>
                <div className="flex items-center mb-4">
                  <Avatar src={testimonial.avatar} size="lg" />
                  <p className="ml-4 font-semibold">{testimonial.name}</p>
                </div>
                <p className="text-sm">{testimonial.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;