import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Link } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import AuthAPI from "../services/auth.api";

const AnimatedErrorMessage = ({ message }) => {
  return (
    <motion.div
      className="bg-red-500 text-white px-4 py-3 rounded-md mb-6 text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span className="block font-semibold">
        {message.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </motion.div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = () => {
    const validationErrors = AuthAPI.validateSigninData({ email, password });
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await AuthAPI.signin({ email, password });

      const token = sessionStorage.getItem("access_token");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!token || !userData) {
        navigate("/login");
        return;
      }

      if (userData.role.toString().toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role.toString().toLowerCase() === "user") {
        navigate("/user/dashboard");
      }
    } catch (error) {
      try {
        const errorData = JSON.parse(error.message);
        setErrors(errorData);
      } catch {
        setErrors({ form: error.message || "Invalid email or password" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextInputRef.current.focus();
    }
  };

  return (
    <motion.div
      className="flex min-h-screen bg-black text-white items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: "url(assets/login-signup/background.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <motion.div
        className="relative w-full max-w-md p-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Login to UniLife
        </h2>
        <AnimatePresence>
          {errors.form && <AnimatedErrorMessage message={errors.form} />}
        </AnimatePresence>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              ref={emailRef}
              label="Email"
              placeholder="name@university.edu"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: null }));
                }
              }}
              onKeyPress={(e) => handleKeyPress(e, passwordRef)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              classNames={{
                input: [
                  "bg-transparent",
                  "text-white",
                  "placeholder:text-gray-400",
                ],
                label: "text-white",
                inputWrapper: [
                  "border-white",
                  "hover:border-purple-400",
                  "focus:border-purple-400",
                  "focus-within:border-purple-400",
                ],
              }}
              autoFocus
            />
          </div>
          <div>
            <Input
              ref={passwordRef}
              label="Password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: null }));
                }
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin(e);
                }
              }}
              classNames={{
                input: [
                  "bg-transparent",
                  "text-white",
                  "placeholder:text-gray-400",
                ],
                label: "text-white",
                inputWrapper: [
                  "border-white",
                  "hover:border-purple-400",
                  "focus:border-purple-400",
                  "focus-within:border-purple-400",
                ],
              }}
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-purple-700 text-white hover:bg-purple-600"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>
          </motion.div>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account yet?{" "}
          <Link
            href="/signup"
            className="text-purple-400 hover:text-purple-300"
          >
            Sign up for free
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;