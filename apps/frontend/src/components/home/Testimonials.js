import React from 'react';
import { Card, CardBody, Avatar } from "@nextui-org/react";

const testimonials = [
  { name: "John Doe", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "This platform has made my university experience so much better! I've made friends from all over the world" },
  { name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1723200166097-4eed8c141f03?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "The study groups feature helped me improve my grades and connect with classmates" },
  { name: "Raymond Ndlovu", avatar: "https://plus.unsplash.com/premium_photo-1693258698597-1b2b1bf943cc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "I love the events section! I Brealy had any friends , if it wasn't for this website i would be still alone ): , I even became white thanks to it  " },
  { name: "Emily Brown", avatar: "https://images.unsplash.com/photo-1722329434628-5cc2d041ff09?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "The language exchange feature is amazing. I've improved my language skills while making new friends" },
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