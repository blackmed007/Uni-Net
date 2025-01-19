import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, X, Image } from "lucide-react";
import { motion } from "framer-motion";
import BlogsAPI from '../../../services/blogs.api';

const CreateBlogPostModal = ({ isOpen, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [newPost, setNewPost] = useState({
    title: '',
    author: '',
    authorImage: '',
    category: '',
    content: '',
    excerpt: '',
    status: 'Draft',
    image: null
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedAuthorImage, setUploadedAuthorImage] = useState(null);

  const handleChange = (key, value) => {
    setNewPost(prev => ({ ...prev, [key]: value }));
    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [type === 'post' ? 'image' : 'authorImage']: 'Please upload a valid image file (JPEG, PNG, or GIF)'
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [type === 'post' ? 'image' : 'authorImage']: 'Image size should be less than 5MB'
      }));
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'post') {
          setUploadedImage(reader.result);
          setNewPost(prev => ({ ...prev, image: file }));
        } else {
          setUploadedAuthorImage(reader.result);
          setNewPost(prev => ({ ...prev, authorImage: file }));
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling image upload:', error);
      setErrors(prev => ({
        ...prev,
        [type === 'post' ? 'image' : 'authorImage']: 'Error uploading image'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newPost.title?.trim()) newErrors.title = 'Title is required';
    if (!newPost.author?.trim()) newErrors.author = 'Author name is required';
    if (!newPost.category?.trim()) newErrors.category = 'Category is required';
    if (!newPost.content?.trim()) newErrors.content = 'Content is required';
    if (!newPost.excerpt?.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!newPost.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const blogData = {
        ...newPost,
        title: newPost.title.trim(),
        author: newPost.author.trim(),
        category: newPost.category.trim(),
        excerpt: newPost.excerpt.trim(),
        content: newPost.content.trim(),
        status: newPost.status
      };

      const createdBlog = await BlogsAPI.createBlog(blogData);
      onSave(createdBlog);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating blog post:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Error creating blog post'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewPost({
      title: '',
      author: '',
      authorImage: '',
      category: '',
      content: '',
      excerpt: '',
      status: 'Draft',
      image: null
    });
    setUploadedImage(null);
    setUploadedAuthorImage(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
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
            Create New Blog Post
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          {errors.submit && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
              {errors.submit}
            </div>
          )}

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              label="Title"
              placeholder="Enter post title"
              value={newPost.title}
              onChange={(e) => handleChange('title', e.target.value)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              isRequired
            />

            <div className="flex gap-4">
              <Input
                label="Author"
                placeholder="Enter author name"
                value={newPost.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="flex-1"
                isInvalid={!!errors.author}
                errorMessage={errors.author}
                isRequired
              />
              <Input
                label="Category"
                placeholder="Enter post category"
                value={newPost.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="flex-1"
                isInvalid={!!errors.category}
                errorMessage={errors.category}
                isRequired
              />
            </div>

            {/* Author Image Upload Section */}
            <div>
              <p className="text-small font-bold mb-2">Author Image</p>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'author')}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload author image</p>
                  </div>
                </label>
              </div>
              {errors.authorImage && (
                <p className="text-red-500 text-sm mt-1">{errors.authorImage}</p>
              )}
              {uploadedAuthorImage && (
                <div className="relative mt-4 inline-block">
                  <img
                    src={uploadedAuthorImage}
                    alt="Author preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    size="sm"
                    onPress={() => {
                      setUploadedAuthorImage(null);
                      handleChange('authorImage', '');
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>

            <Textarea
              label="Excerpt"
              placeholder="Enter post excerpt"
              value={newPost.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              isInvalid={!!errors.excerpt}
              errorMessage={errors.excerpt}
              isRequired
            />

            <div className="h-64 border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={newPost.content}
                onChange={(content) => handleChange('content', content)}
                className="h-full"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            <div className="flex justify-between items-center gap-4">
              <Select
                label="Status"
                placeholder="Select post status"
                selectedKeys={[newPost.status]}
                onChange={(e) => handleChange('status', e.target.value)}
                className="max-w-xs"
                isRequired
              >
                <SelectItem key="Draft" value="Draft">Draft</SelectItem>
                <SelectItem key="Published" value="Published">Published</SelectItem>
              </Select>

              <Button
                color="primary"
                variant="flat"
                onPress={() => document.getElementById('post-image-upload').click()}
                startContent={<Upload size={20} />}
              >
                Upload Post Image
              </Button>
            </div>

            <input
              id="post-image-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'post')}
              accept="image/*"
            />

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}

            {uploadedImage && (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                />
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => {
                    setUploadedImage(null);
                    handleChange('image', null);
                  }}
                  className="absolute top-2 right-2"
                >
                  <X size={20} />
                </Button>
              </div>
            )}
          </motion.div>
        </ModalBody>

        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={handleClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Create Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBlogPostModal;