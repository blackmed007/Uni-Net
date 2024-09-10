import React from 'react';
import { Image } from "@nextui-org/react";

const universities = [
  { name: "University 1", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/640px-Harvard_University_coat_of_arms.svg.png" },
  { name: "University 2", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4p1KGxUQBL78nnANzWek4uhuT9lhEyMvVAA&s" },
  { name: "University 3", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDcoUPQJDmUKQ2azryxP0awcEPSTsjBY8d9A&s" },
  { name: "University 4", logo: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/032024/znak-pwr_pion-cmyk-pl.jpg?ArcVQ1VnLZKRHmD602lminCuWO3iTXxf&itok=-xIxvZM2" },
  { name: "University 5", logo: "https://amu.edu.pl/__data/assets/image/0017/45611/varieties/w300.jpg" },
  { name: "University 6", logo: "https://www.edarabia.com/wp-content/uploads/2018/02/poznan-university-economics-business-poznan-poland.png" },

];

const Universities = () => {
  return (
    <div className="bg-black-900 py-16">
         <br></br> <br></br>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Participating Universities</h2>
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
      <br></br> <br></br> <br></br> 
    </div>
   
  );
};

export default Universities;