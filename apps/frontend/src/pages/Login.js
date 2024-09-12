import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Link } from "@nextui-org/react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Fetch users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));

      if (user.profileCompleted) {
        navigate('/user/dashboard');
      } else {
        navigate('/user/onboarding');
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
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
          <h2 className="text-3xl font-bold mb-6 text-white">Login to UniConnect</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              placeholder="name@university.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                label: "text-white"
              }}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              classNames={{
                input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                label: "text-white"
              }}
            />
            <div className="flex justify-between items-center">
              <Link href="#" size="sm" className="text-purple-400 hover:text-purple-300">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-600">
              Login
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300">Sign up for free</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;