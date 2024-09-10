import React from 'react';
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <footer className="bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Get involved in our community.</h3>
          <p className="text-xl">Almost Everyone is welcome!</p>
        </div>
        <div className="flex justify-center space-x-6 mb-8">
          <Link href="#" aria-label="Facebook">
            <FontAwesomeIcon icon={['fab', 'facebook-f']} size="2x" />
          </Link>
          <Link href="#" aria-label="Twitter">
            <FontAwesomeIcon icon={['fab', 'twitter']} size="2x" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" />
          </Link>
          <Link href="#" aria-label="Discord">
            <FontAwesomeIcon icon={['fab', 'discord']} size="2x" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <FontAwesomeIcon icon={['fab', 'github']} size="2x" />
          </Link>
        </div>
        <p className="text-center text-sm">© 2024 University Life. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;