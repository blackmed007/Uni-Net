import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <h1 className="text-2xl font-bold">UniNet</h1>
          </Link>
        </div>
        <nav>
          <div className="flex">
            <Link
              to="/login"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;