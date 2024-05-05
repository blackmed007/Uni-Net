import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Our Story</h3>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Learn more about our journey and mission.
            </a>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">Study Groups</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">Events</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">Alumni Networking</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">Global Exchange</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Get in touch with us.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;