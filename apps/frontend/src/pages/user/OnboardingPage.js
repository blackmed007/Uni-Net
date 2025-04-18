import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import AuthAPI from "../../services/auth.api";

const API_URL = "http://localhost:5004/api/v1";

const AnimatedErrorMessage = ({ message }) => (
  <motion.div
    className="bg-red-500 text-white px-4 py-3 rounded-md mb-4"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    {message}
  </motion.div>
);

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    universityId: "",
    cityId: "",
    gender: "",
    profile_url: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = AuthAPI.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [universitiesRes, citiesRes] = await Promise.all([
          fetch(`${API_URL}/universities`, { headers }),
          fetch(`${API_URL}/cities`, { headers }),
        ]);

        if (!universitiesRes.ok || !citiesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [universitiesData, citiesData] = await Promise.all([
          universitiesRes.json(),
          citiesRes.json(),
        ]);

        setUniversities(universitiesData);
        setCities(citiesData);
      } catch (err) {
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, profile_url: file }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, profile_url: null }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, profile_url: null }));
    setImagePreview(null);
    setFieldErrors((prev) => ({ ...prev, profile_url: "Profile picture is required" }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.universityId) {
      errors.universityId = "University is required";
    }
    if (!formData.cityId) {
      errors.cityId = "City is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.profile_url) {
      errors.profile_url = "Profile picture is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthAPI.onboard({
        ...formData,
        profile_url: formData.profile_url,
        gender: formData.gender.toLowerCase(),
      });

      // Update the user data in localStorage with the response data
      const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUserData = {
        ...currentUserData,
        ...response,
        role: 'user' // Ensure role is set
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      navigate("/user");
    } catch (error) {
      try {
        const errorData = JSON.parse(error.message);
        setError(Object.values(errorData)[0]); // Show first error message
      } catch {
        setError(error.message || "Failed to complete onboarding");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(/assets/login-signup/background.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Complete Your Profile
        </h2>

        <AnimatePresence>
          {error && <AnimatedErrorMessage message={error} />}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="University"
            placeholder="Select your university"
            value={formData.universityId}
            onChange={(e) => handleChange("universityId", e.target.value)}
            className="w-full"
            isInvalid={!!fieldErrors.universityId}
            errorMessage={fieldErrors.universityId}
            classNames={{
              label: "text-white",
              trigger: "bg-transparent border-white/20",
              listbox: "bg-black/60 backdrop-blur-xl text-white",
              popoverContent: "bg-black/60 backdrop-blur-xl",
            }}
          >
            {universities.map((uni) => (
              <SelectItem key={uni.id} value={uni.id} className="text-white">
                {uni.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="City"
            placeholder="Select your city"
            value={formData.cityId}
            onChange={(e) => handleChange("cityId", e.target.value)}
            className="w-full"
            isInvalid={!!fieldErrors.cityId}
            errorMessage={fieldErrors.cityId}
            classNames={{
              label: "text-white",
              trigger: "bg-transparent border-white/20",
              listbox: "bg-black/60 backdrop-blur-xl text-white",
              popoverContent: "bg-black/60 backdrop-blur-xl",
            }}
          >
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id} className="text-white">
                {city.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Gender"
            placeholder="Select your gender"
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full"
            isInvalid={!!fieldErrors.gender}
            errorMessage={fieldErrors.gender}
            classNames={{
              label: "text-white",
              trigger: "bg-transparent border-white/20",
              listbox: "bg-black/60 backdrop-blur-xl text-white",
              popoverContent: "bg-black/60 backdrop-blur-xl",
            }}
          >
            <SelectItem key="male" value="male" className="text-white">
              Male
            </SelectItem>
            <SelectItem key="female" value="female" className="text-white">
              Female
            </SelectItem>
          </Select>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Profile Picture (Required)</label>
            {!imagePreview ? (
              <label className={`flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-lg appearance-none cursor-pointer hover:border-white/20 focus:outline-none ${
                fieldErrors.profile_url 
                  ? "bg-red-500/10 border-red-500/50" 
                  : "bg-black/30 border-white/10"
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm text-white/60">Click to upload</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-full h-32">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {fieldErrors.profile_url && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.profile_url}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Completing Profile..." : "Complete Profile"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;