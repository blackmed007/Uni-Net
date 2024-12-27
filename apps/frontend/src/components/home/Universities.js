import React from 'react';
import { Image } from "@nextui-org/react";

const UNIVERSITIES = [
  { 
    id: 'university-1',
    name: "Harvard University", 
    logo: "assets/home/University-harvard.png" 
  },
  { 
    id: 'university-2',
    name: "WSB University", 
    logo: "assets/home/University-wsb.png" 
  },
  { 
    id: 'university-3',
    name: "Poznan University of Economics and Business", 
    logo: "assets/home/University-POZNAN UNIVERSITY OF ECONOMICS AND BUSINESS.png" 
  },
  { 
    id: 'university-4',
    name: "Wrocław University of Technology", 
    logo: "assets/home/University-Politechnika Wroctawska.jpg" 
  },
  { 
    id: 'university-5',
    name: "Adam Mickiewicz University", 
    logo: "assets/home/University-UAM.jpg" 
  },
  { 
    id: 'university-6',
    name: "Poznan University of Technology", 
    logo: "assets/home/University-put.png" 
  },
];

const UniversityLogo = ({ university }) => {
  const { name, logo } = university;

  return (
    <div className="flex justify-center items-center p-4 lg:p-0">
      <Image
        src={logo}
        alt={`${name} logo`}
        className="opacity-70 hover:opacity-100 transition-opacity"
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

const Universities = () => {
  return (
    <div className="bg-black-900 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-center mb-8 md:mb-12 px-4">
          Participating Universities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-8">
          {UNIVERSITIES.map((university) => (
            <UniversityLogo 
              key={university.id} 
              university={university} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Universities;