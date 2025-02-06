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
  Textarea,
  Spinner
} from "@nextui-org/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const EditBlogPostModal = ({ isOpen, onClose, post, onSave }) => {
  const [editedPost, setEditedPost] = useState({
    title: '',
    author: '',
    author_profile_url: '',
    category: '',
    content: '',
    excerpt: '',
    status: 'Draft',
    blog_image: '',
  });

  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      setEditedPost({
        ...post,
        blog_image: post.blog_image || '',
        author_profile_url: post.author_profile_url || ''
      });
      setBlogImagePreview(post.blog_image);
      setAuthorImagePreview(post.author_profile_url);
    }
  }, [post]);

  const handleChange = (key, value) => {
    setEditedPost(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateFileUpload = (file, type) => {
    if (!file) return null;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return `Please upload a valid image file (JPEG, PNG, GIF, or WebP)`;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return `Image size should be less than 5MB`;
    }

    return null;
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const errorMessage = validateFileUpload(file);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setIsUploading(true);

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'blog') {
          setBlogImagePreview(reader.result);
          setEditedPost(prev => ({ ...prev, blog_image: file }));
        } else if (type === 'author') {
          setAuthorImagePreview(reader.result);
          setEditedPost(prev => ({ ...prev, author_profile_url: file }));
        }
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!editedPost.title?.trim()) errors.title = 'Title is required';
    if (!editedPost.author?.trim()) errors.author = 'Author is required';
    if (!editedPost.category?.trim()) errors.category = 'Category is required';
    if (!editedPost.content?.trim()) errors.content = 'Content is required';
    if (!editedPost.excerpt?.trim()) errors.excerpt = 'Excerpt is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      await onSave(editedPost);
      handleClose();
      toast.success('Blog post updated successfully!');
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditedPost({
      title: '',
      author: '',
      author_profile_url: '',
      category: '',
      content: '',
      excerpt: '',
      status: 'Draft',
      blog_image: '',
    });
    setBlogImagePreview(null);
    setAuthorImagePreview(null);
    setErrors({});
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
            Edit Blog Post
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              label="Title"
              placeholder="Enter post title"
              value={editedPost.title}
              onChange={(e) => handleChange('title', e.target.value)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              isRequired
            />

            <div className="flex gap-4">
              <Input
                label="Author"
                placeholder="Enter author name"
                value={editedPost.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="flex-1"
                isInvalid={!!errors.author}
                errorMessage={errors.author}
                isRequired
              />
              <Input
                label="Category"
                placeholder="Enter post category"
                value={editedPost.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="flex-1"
                isInvalid={!!errors.category}
                errorMessage={errors.category}
                isRequired
              />
            </div>

            <div className="space-y-2">
              <p className="text-small font-medium">Author Image</p>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="author-image"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'author')}
                  accept="image/*"
                  disabled={isSubmitting || isUploading}
                />
                <label
                  htmlFor="author-image"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-400 hover:border-gray-200 transition-colors"
                >
                  <Upload size={20} />
                  <span>{isUploading ? 'Uploading...' : 'Choose author image'}</span>
                </label>
                {authorImagePreview && (
                  <div className="relative w-16 h-16">
                    <img
                      src={authorImagePreview}
                      alt="Author preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setEditedPost(prev => ({ ...prev, author_profile_url: '' }));
                        setAuthorImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </div>
              {errors.author_profile_url && (
                <p className="text-danger text-xs">{errors.author_profile_url}</p>
              )}
            </div>

            <Textarea
              label="Excerpt"
              placeholder="Enter post excerpt"
              value={editedPost.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              isInvalid={!!errors.excerpt}
              errorMessage={errors.excerpt}
              isRequired
            />

            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={editedPost.content}
                onChange={(content) => handleChange('content', content)}
                style={{ height: '200px' }}
              />
            </div>
            {errors.content && (
              <p className="text-danger text-xs">{errors.content}</p>
            )}

            <div className="flex justify-between items-center gap-4">
              <Select
                label="Status"
                selectedKeys={[editedPost.status]}
                onChange={(e) => handleChange('status', e.target.value)}
                className="max-w-xs"
              >
                <SelectItem key="Draft" value="Draft">Draft</SelectItem>
                <SelectItem key="Published" value="Published">Published</SelectItem>
              </Select>

              <div className="space-y-2">
                <input
                  type="file"
                  id="blog-image"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'blog')}
                  accept="image/*"
                  disabled={isSubmitting || isUploading}
                />
                <label
                  htmlFor="blog-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 transition-colors"
                >
                  <Upload size={20} />
                  <span>{isUploading ? 'Uploading...' : 'Upload Blog Image'}</span>
                </label>
                {errors.blog_image && (
                  <p className="text-danger text-xs">{errors.blog_image}</p>
                )}
              </div>
            </div>

            {blogImagePreview && (
              <div className="relative">
                <img
                  src={blogImagePreview}
                  alt="Blog preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => {
                    setEditedPost(prev => ({ ...prev, blog_image: '' }));
                    setBlogImagePreview(null);
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
            isDisabled={isSubmitting || isUploading}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
          >
            Cancel
          </Button>
          <Button 
            color="primary"
            onPress={handleSubmit}
            isDisabled={isSubmitting || isUploading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            startContent={isSubmitting ? <Spinner size="sm" color="white" /> : null}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBlogPostModal;