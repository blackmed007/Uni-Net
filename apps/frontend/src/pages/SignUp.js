import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from 'lucide-react';
import AuthAPI from '../services/auth.api';

const AnimatedErrorMessage = ({ message }) => (
  <motion.p
    className="text-red-500 text-sm mt-1"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {message}
  </motion.p>
);

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateTerms = () => {
    if (!formData.agreeToTerms) {
      setErrors(prev => ({
        ...prev,
        agreeToTerms: "You must agree to the Terms of Service and Privacy Policy"
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTerms()) return;
    
    setIsLoading(true);
    try {
      await AuthAPI.signup(formData);
      navigate('/onboarding');
    } catch (error) {
      try {
        // Check if error message is JSON string containing validation errors
        const errorData = JSON.parse(error.message);
        setErrors(prev => ({
          ...prev,
          ...errorData
        }));
      } catch {
        // If not JSON, set as form error
        setErrors({ form: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="relative flex min-h-screen bg-black text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/login-signup/background.avif)',
          filter: 'brightness(30%)'
        }}
      ></div>
  
      <motion.div 
        className="relative w-full max-w-md p-8 m-auto bg-black bg-opacity-20 backdrop-blur-sm rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Create Account</h2>
        
        <AnimatePresence>
          {errors.form && (
            <motion.div
              className="bg-red-500 text-white px-4 py-3 rounded-md mb-6 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {errors.form}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <Input
              name="firstName"
              label="First name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName}
              classNames={{
                input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                label: "text-white",
                inputWrapper: ["border-gray-500", "hover:border-purple-500", "focus-within:!border-purple-500"]
              }}
            />
            <Input
              name="lastName"
              label="Last name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName}
              classNames={{
                input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
                label: "text-white",
                inputWrapper: ["border-gray-500", "hover:border-purple-500", "focus-within:!border-purple-500"]
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
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            classNames={{
              input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
              label: "text-white",
              inputWrapper: ["border-gray-500", "hover:border-purple-500", "focus-within:!border-purple-500"]
            }}
          />

          <Input
            name="password"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            errorMessage={errors.password}
            endContent={
              <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                {isVisible ? (
                  <EyeOff className="text-2xl text-gray-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-gray-400 pointer-events-none" />
                )}
              </button>
            }
            classNames={{
              input: ["bg-transparent", "text-white", "placeholder:text-gray-400"],
              label: "text-white",
              inputWrapper: ["border-gray-500", "hover:border-purple-500", "focus-within:!border-purple-500"]
            }}
          />

          <div className="space-y-2">
            <Checkbox
              name="agreeToTerms"
              isSelected={formData.agreeToTerms}
              onValueChange={(checked) => handleChange({ target: { name: 'agreeToTerms', type: 'checkbox', checked } })}
              classNames={{
                label: "text-white"
              }}
            >
              <span className="text-white">I agree to the Terms of Service and Privacy Policy</span>
            </Checkbox>
            <AnimatePresence>
              {errors.agreeToTerms && <AnimatedErrorMessage message={errors.agreeToTerms} />}
            </AnimatePresence>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              type="submit" 
              className="w-full bg-purple-700 text-white hover:bg-purple-600"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </motion.div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;