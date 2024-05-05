import React from 'react';

const LearnMorePage = () => {
  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Why UniNet?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-gray-400 mb-4">
              UniNet was created by a group of students in Poland who recognized the need for a platform that
              could bring together students from various universities and connect them with alumni and
              professionals in their field.
            </p>
            <p className="text-gray-400 mb-4">
              Our goal is to provide a supportive community where students can share knowledge, find study
              groups, attend events, and build a network that will benefit them throughout their academic
              journey and beyond.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-400 mb-4">
              At UniNet, we believe in the power of collaboration and networking. We strive to create an
              environment where students can:
            </p>
            <ul className="list-disc list-inside text-gray-400">
              <li>Connect with peers who share similar academic interests</li>
              <li>Discover and participate in campus events and activities</li>
              <li>Seek guidance and mentorship from alumni and professionals</li>
              <li>Explore international student exchange programs</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Join UniNet Today</h3>
          <p className="text-gray-400 mb-8">
            Start building your network and unlock a world of opportunities.
          </p>
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePage;