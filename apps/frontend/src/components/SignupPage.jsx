import React from 'react';

const SignupPage = () => {
  return (
    <div className="bg-white flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>
        <p className="text-gray-600 text-center mb-6">Join UniNet and start your adventure</p>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-400 p-2 w-full rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-400 p-2 w-full rounded"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-700 font-bold mb-2">
              Country
            </label>
            <select id="country" className="border border-gray-400 p-2 w-full rounded">
              <option value="">Select your country</option>
              {/* Add options for different countries */}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="university" className="block text-gray-700 font-bold mb-2">
              University Name
            </label>
            <input
              type="text"
              id="university"
              className="border border-gray-400 p-2 w-full rounded"
              placeholder="Enter your university name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
              Current Role
            </label>
            <select id="role" className="border border-gray-400 p-2 w-full rounded">
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              {/* Add other options as needed */}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          >
            Create Account
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Sign In
            </a>
          </p>
          <p className="text-center text-gray-600 mt-4">or</p>
          <div className="flex justify-center mt-4">
            <a href="#" className="mx-2 text-blue-600 hover:text-blue-800">
              <i className="fab fa-facebook fa-2x"></i>
            </a>
            <a href="#" className="mx-2 text-blue-600 hover:text-blue-800">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a href="#" className="mx-2 text-blue-600 hover:text-blue-800">
              <i className="fab fa-google fa-2x"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;