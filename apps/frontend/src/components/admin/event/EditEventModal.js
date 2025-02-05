import React, { useState, useEffect } from 'react';
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
  Avatar,
  Spinner
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Upload, X } from 'lucide-react';

const EditUserModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave, 
  universities, 
  cities,
  error: externalError
}) => {
  const [editedUser, setEditedUser] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [internalError, setInternalError] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedUser({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        gender: user.gender || '',
        universityId: user.universityId || '',
        cityId: user.cityId || '',
        status: user.status === 'Active' || user.status === true, // Convert to boolean
        profile_url: user.profile_url || null
      });
      setImagePreview(user.profile_url);
    }
    // Reset errors when modal opens
    setErrors({});
    setInternalError(null);
  }, [user, isOpen]);

  // Update internal error when external error changes
  useEffect(() => {
    if (externalError) {
      setInternalError(externalError);
    }
  }, [externalError]);

  const handleChange = (key, value) => {
    setEditedUser(prev => ({ ...prev, [key]: value }));
    // Clear error for the field being changed
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
    // Clear internal error when user makes changes
    setInternalError(null);
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
    setEditedUser(prev => ({ ...prev, profile_url: file }));
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
    setEditedUser(prev => ({ ...prev, profile_url: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editedUser.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!editedUser.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!editedUser.email?.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(editedUser.email)) newErrors.email = 'Invalid email format';
    if (!editedUser.role) newErrors.role = 'Role is required';
    if (!editedUser.gender) newErrors.gender = 'Gender is required';
    if (!editedUser.universityId) newErrors.universityId = 'University is required';
    if (!editedUser.cityId) newErrors.cityId = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setInternalError(null);
      
      // Ensure status is boolean before saving
      const userDataToSave = {
        ...editedUser,
        status: Boolean(editedUser.status)
      };
      
      await onSave(userDataToSave);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setInternalError(error.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setInternalError(null);
    onClose();
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
            Edit User
          </motion.h2>
        </ModalHeader>
        
        <ModalBody>
          {internalError && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
              {internalError}
            </div>
          )}

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Image Upload */}
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

            {/* User Info Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={editedUser.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                errorMessage={errors.firstName}
                isInvalid={!!errors.firstName}
                classNames={{
                  input: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
                isRequired
              />
              <Input
                label="Last Name"
                value={editedUser.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                errorMessage={errors.lastName}
                isInvalid={!!errors.lastName}
                classNames={{
                  input: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
                isRequired
              />
            </div>

            <Input
              label="Email"
              value={editedUser.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              errorMessage={errors.email}
              isInvalid={!!errors.email}
              classNames={{
                input: ["bg-transparent", "text-white"],
                label: "text-white",
              }}
              isRequired
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                selectedKeys={editedUser.role ? [editedUser.role] : []}
                onChange={(e) => handleChange('role', e.target.value)}
                errorMessage={errors.role}
                isInvalid={!!errors.role}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
                isRequired
              >
                <SelectItem key="admin" value="admin">Admin</SelectItem>
                <SelectItem key="user" value="user">User</SelectItem>
              </Select>

              <Select
                label="Gender"
                selectedKeys={editedUser.gender ? [editedUser.gender] : []}
                onChange={(e) => handleChange('gender', e.target.value)}
                errorMessage={errors.gender}
                isInvalid={!!errors.gender}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
                isRequired
              >
                <SelectItem key="male" value="male">Male</SelectItem>
                <SelectItem key="female" value="female">Female</SelectItem>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="University"
                selectedKeys={editedUser.universityId ? [editedUser.universityId] : []}
                onChange={(e) => handleChange('universityId', e.target.value)}
                errorMessage={errors.universityId}
                isInvalid={!!errors.universityId}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
                isRequired
              >
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="City"
                selectedKeys={editedUser.cityId ? [editedUser.cityId] : []}
                onChange={(e) => handleChange('cityId', e.target.value)}
                errorMessage={errors.cityId}
                isInvalid={!!errors.cityId}
                classNames={{
                  trigger: ["bg-transparent", "text-white"],
                  label: "text-white",
                }}
                isRequired
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
              selectedKeys={[editedUser.status ? 'active' : 'suspended']}
              onChange={(e) => handleChange('status', e.target.value === 'active')}
              classNames={{
                trigger: ["bg-transparent", "text-white"],
                label: "text-white",
              }}
            >
              <SelectItem key="active" value="active">Active</SelectItem>
              <SelectItem key="suspended" value="suspended">Suspended</SelectItem>
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
            {isLoading ? <Spinner color="white" size="sm" /> : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;