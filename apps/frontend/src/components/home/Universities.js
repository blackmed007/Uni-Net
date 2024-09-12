import React from 'react';
import { Image } from "@nextui-org/react";

const universities = [
  { name: "University 1", logo: "assets/home/University-harvard.png" },
  { name: "University 2", logo: "assets/home/University-wsb.png" },
  { name: "University 3", logo: "assets/home/University-POZNAN UNIVERSITY OF ECONOMICS AND BUSINESS.png" },
  { name: "University 4", logo: "assets/home/University-Politechnika Wroctawska.jpg" },
  { name: "University 5", logo: "assets/home/University-UAM.jpg" },
  { name: "University 6", logo: "assets/home/University-put.png" },
];

const Universities = () => {
  return (
    <div className="bg-black-900 py-16">
      <br /><br />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Participating Universities</h2>
        <br /><br />
        <div className="flex flex-wrap justify-center items-center gap-8">
          {universities.map((university, index) => (
            <Image
              key={index}
              src={university.logo}
              alt={university.name}
              width={100}
              height={100}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
      <br /><br />
    </div>
  );
};

export default Universities;