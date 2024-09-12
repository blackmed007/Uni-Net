import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import { motion } from "framer-motion";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password, // In a real app, this should be hashed
      role: 'Student',
      status: 'Active',
      profileCompleted: false,
      registrationDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Store user in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Store current user data
    localStorage.setItem('userData', JSON.stringify(newUser));

    // Redirect to onboarding page
    navigate('/user/onboarding');
  };

  return (
    <div className="relative flex min-h-screen bg-black text-white"
      style={{
        backgroundImage: 'url(assets/login-signup/background.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      
      <div className="absolute inset-0 bg-black opacity-70"></div>
  
      <div className="relative w-full max-w-md p-8 m-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Create Account</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <Input
                name="firstName"
                label="First name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-1/2"
                classNames={{
                  input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                  label: "text-white"
                }}
              />
              <Input
                name="lastName"
                label="Last name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-1/2"
                classNames={{
                  input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                  label: "text-white"
                }}
              />
            </div>
            <Input
              name="email"
              label="Email"
              placeholder="name@university.edu"
              type="email"
              value={formData.email}
              onChange={handleChange}
              classNames={{
                input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                label: "text-white"
              }}
            />
            <Input
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              classNames={{
                input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                label: "text-white"
              }}
            />
            <Checkbox
              name="agreeToTerms"
              isSelected={formData.agreeToTerms}
              onValueChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
              className="text-sm text-white-300"
            >
              I agree to the Terms of Service and Privacy Policy
            </Checkbox>
            <Button type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-600">
              Sign Up
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;