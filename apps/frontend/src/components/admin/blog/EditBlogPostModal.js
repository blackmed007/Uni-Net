import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";

const EditBlogPostModal = ({ isOpen, onClose, post, onSave }) => {
  const [editedPost, setEditedPost] = useState(post || {});

  useEffect(() => {
    setEditedPost(post || {});
  }, [post]);

  const handleChange = (key, value) => {
    setEditedPost(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPost(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (Object.values(editedPost).some(value => value === '')) {
      alert('All fields are required');
      return;
    }
    onSave(editedPost);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
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
            />
            <div className="flex gap-4">
              <Input
                label="Author"
                placeholder="Enter author name"
                value={editedPost.author || ''}
                onChange={(e) => handleChange('author', e.target.value)}
                className="flex-1"
                isRequired
              />
              <Input
                label="Category"
                placeholder="Enter post category"
                value={editedPost.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="flex-1"
                isRequired
              />
            </div>
            <Textarea
              label="Excerpt"
              placeholder="Enter post excerpt"
              value={editedPost.excerpt || ''}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              isRequired
            />
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={editedPost.content || ''}
                onChange={(content) => handleChange('content', content)}
                style={{ height: '200px' }}
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
              >
                <SelectItem key="Draft" value="Draft">Draft</SelectItem>
                <SelectItem key="Published" value="Published">Published</SelectItem>
              </Select>
              <Button
                color="primary"
                variant="flat"
                onPress={() => document.getElementById('edit-dropzone-file').click()}
                startContent={<Upload size={20} />}
              >
                Upload Image
              </Button>
            </div>
            <input
              id="edit-dropzone-file"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {editedPost.image && (
              <div className="relative">
                <img src={editedPost.image} alt="Preview" className="max-w-full h-auto rounded-lg" />
                <Button
                  isIconOnly
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => handleChange('image', null)}
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
            onPress={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBlogPostModal;