import React, { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Avatar
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Upload, X } from 'lucide-react';

const CreateUserModal = ({ isOpen, onClose, onSave, universities, cities }) => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    universityId: '',
    cityId: '',
    gender: '',
    status: 'Active',
    profile_url: null
  };

  const [newUser, setNewUser] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key, value) => {
    setNewUser(prev => ({ ...prev, [key]: value }));
    // Clear error for the field being changed
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        profile_url: 'Please upload a valid image file (JPEG, PNG, or GIF)'
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        profile_url: 'Image size should be less than 5MB'
      }));
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Update form data
    setNewUser(prev => ({ ...prev, profile_url: file }));
    // Clear any existing image error
    if (errors.profile_url) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.profile_url;
        return newErrors;
      });
    }
  };

  const removeImage = () => {
    setNewUser(prev => ({ ...prev, profile_url: null }));
    setImagePreview(null);
    // Add error when image is removed since it's required
    setErrors(prev => ({
      ...prev,
      profile_url: 'Profile image is required'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newUser.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!newUser.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!newUser.email?.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(newUser.email)) newErrors.email = 'Invalid email format';
    if (!newUser.password) newErrors.password = 'Password is required';
    if (newUser.password && newUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!newUser.role) newErrors.role = 'Role is required';
    if (!newUser.gender) newErrors.gender = 'Gender is required';
    if (!newUser.universityId) newErrors.universityId = 'University is required';
    if (!newUser.cityId) newErrors.cityId = 'City is required';
    // Add validation for required profile image
    if (!newUser.profile_url) newErrors.profile_url = 'Profile image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setNewUser(initialFormState);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const userData = {
        ...newUser,
        status: newUser.status === 'Active'
      };
      
      await onSave(userData);
      handleClose();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: 'Failed to create user. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            Create New User
          </motion.h2>
        </ModalHeader>
        
        <ModalBody>
          {errors.submit && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
              {errors.submit}
            </div>
          )}

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex justify-center">
                {imagePreview ? (
                  <div className="relative">
                    <Avatar
                      src={imagePreview}
                      className="w-24 h-24"
                      alt="Profile preview"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-danger rounded-full text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              {errors.profile_url && (
                <p className="text-danger text-sm text-center">{errors.profile_url}</p>
              )}
              <p className="text-sm text-gray-400">Profile image is required*</p>
            </div>

            {/* User Info Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={newUser.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                errorMessage={errors.firstName}
                isInvalid={!!errors.firstName}
                classNames={{
                  input: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
              />
              <Input
                label="Last Name"
                value={newUser.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                errorMessage={errors.lastName}
                isInvalid={!!errors.lastName}
                classNames={{
                  input: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => handleChange('email', e.target.value)}
              errorMessage={errors.email}
              isInvalid={!!errors.email}
              classNames={{
                input: ["bg-transparent", "text-white"],
                label: "text-white",
              }}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={newUser.password}
              onChange={(e) => handleChange('password', e.target.value)}
              errorMessage={errors.password}
              isInvalid={!!errors.password}
              endContent={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              classNames={{
                input: ["bg-transparent", "text-white"],
                label: "text-white",
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                selectedKeys={newUser.role ? [newUser.role] : []}
                onChange={(e) => handleChange('role', e.target.value)}
                errorMessage={errors.role}
                isInvalid={!!errors.role}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
              >
                <SelectItem key="admin" value="admin">Admin</SelectItem>
                <SelectItem key="user" value="user">User</SelectItem>
              </Select>

              <Select
                label="Gender"
                selectedKeys={newUser.gender ? [newUser.gender] : []}
                onChange={(e) => handleChange('gender', e.target.value)}
                errorMessage={errors.gender}
                isInvalid={!!errors.gender}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
              >
                <SelectItem key="male" value="male">Male</SelectItem>
                <SelectItem key="female" value="female">Female</SelectItem>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="University"
                selectedKeys={newUser.universityId ? [newUser.universityId] : []}
                onChange={(e) => handleChange('universityId', e.target.value)}
                errorMessage={errors.universityId}
                isInvalid={!!errors.universityId}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
              >
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="City"
                selectedKeys={newUser.cityId ? [newUser.cityId] : []}
                onChange={(e) => handleChange('cityId', e.target.value)}
                errorMessage={errors.cityId}
                isInvalid={!!errors.cityId}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
              >
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Select
              label="Status"
              selectedKeys={[newUser.status]}
              onChange={(e) => handleChange('status', e.target.value)}
              classNames={{
                trigger: ["bg-transparent", "text-white"],
                label: "text-white",
              }}
            >
              <SelectItem key="Active" value="Active">Active</SelectItem>
              <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
            </Select>
          </motion.div>
        </ModalBody>

        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={handleClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Create User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;