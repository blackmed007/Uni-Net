import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea, Spinner } from "@nextui-org/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, X, Image } from "lucide-react";
import { motion } from "framer-motion";
import BlogsAPI from '../../../services/blogs.api';
import { toast } from 'react-hot-toast';

const EditBlogPostModal = ({ isOpen, onClose, post, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editedPost, setEditedPost] = useState(post || {});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedAuthorImage, setUploadedAuthorImage] = useState(null);

  useEffect(() => {
    if (post) {
      setEditedPost(post);
      setUploadedImage(null);
      setUploadedAuthorImage(null);
    }
  }, [post]);

  const handleChange = (key, value) => {
    setEditedPost(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload the image to the server
      const imageUrl = await BlogsAPI.uploadImage(file, type);

      if (type === 'post') {
        setEditedPost(prev => ({ ...prev, image: imageUrl }));
        setUploadedImage(URL.createObjectURL(file));
      } else if (type === 'author') {
        setEditedPost(prev => ({ ...prev, authorImage: imageUrl }));
        setUploadedAuthorImage(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'author', 'category', 'content', 'excerpt'];
    const missingFields = requiredFields.filter(field => !editedPost[field]?.trim());

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSave(editedPost);
      handleClose();
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditedPost(post || {});
    setUploadedImage(null);
    setUploadedAuthorImage(null);
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
              value={editedPost.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              isRequired
              isDisabled={isSubmitting}
            />
            <div className="flex gap-4">
              <Input
                label="Author"
                placeholder="Enter author name"
                value={editedPost.author || ''}
                onChange={(e) => handleChange('author', e.target.value)}
                className="flex-1"
                isRequired
                isDisabled={isSubmitting}
              />
              <Input
                label="Category"
                placeholder="Enter post category"
                value={editedPost.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="flex-1"
                isRequired
                isDisabled={isSubmitting}
              />
            </div>

            {/* Author Image Section */}
            <div>
              <p className="text-small font-bold mb-2">Author Image</p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-xs mb-1">Upload Author Image</p>
                  <label className="flex items-center justify-center w-full h-[38px] px-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'author')}
                      className="hidden"
                      disabled={isSubmitting || isUploading}
                    />
                    <Upload className="text-gray-400 mr-2" size={16} />
                    <span className="text-sm text-gray-400">Choose file</span>
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-xs mb-1">Author Image URL</p>
                  <Input
                    placeholder="Enter author image URL"
                    value={editedPost.authorImage || ''}
                    onChange={(e) => handleChange('authorImage', e.target.value)}
                    startContent={<Image className="text-gray-400" size={16} />}
                    className="h-[38px]"
                    isDisabled={isSubmitting}
                  />
                </div>
              </div>
              {(uploadedAuthorImage || editedPost.authorImage) && (
                <div className="relative mt-4 w-20 h-20">
                  <img 
                    src={uploadedAuthorImage || editedPost.authorImage} 
                    alt="Author" 
                    className="w-full h-full rounded-full object-cover"
                  />
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    size="sm"
                    isDisabled={isSubmitting}
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
              value={editedPost.excerpt || ''}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              isRequired
              isDisabled={isSubmitting}
            />
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={editedPost.content || ''}
                onChange={(content) => handleChange('content', content)}
                style={{ height: '200px' }}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
              />
            </div>
            <div className="flex justify-between items-center gap-4">
              <Select
                label="Status"
                placeholder="Select post status"
                selectedKeys={editedPost.status ? [editedPost.status] : []}
                onChange={(e) => handleChange('status', e.target.value)}
                className="max-w-xs"
                isRequired
                isDisabled={isSubmitting}
              >
                <SelectItem key="Draft" value="Draft">Draft</SelectItem>
                <SelectItem key="Published" value="Published">Published</SelectItem>
              </Select>
              <Button
                color="primary"
                variant="flat"
                onPress={() => document.getElementById('edit-dropzone-file').click()}
                startContent={<Upload size={20} />}
                isDisabled={isSubmitting || isUploading}
              >
                Upload Post Image
              </Button>
            </div>
            <input
              id="edit-dropzone-file"
              type="file"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'post')}
              accept="image/*"
              disabled={isSubmitting || isUploading}
            />
            {(uploadedImage || editedPost.image) && (
              <div className="relative">
                <img 
                  src={uploadedImage || editedPost.image} 
                  alt="Preview" 
                  className="max-w-full h-auto rounded-lg"
                />
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  isDisabled={isSubmitting}
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
            isDisabled={isSubmitting}
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