import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

const CreateBlogPostModal = ({ isOpen, onClose, onSave }) => {
  const [newPost, setNewPost] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    excerpt: '',
    status: 'Draft',
    image: null,
  });

  const handleChange = (key, value) => {
    setNewPost(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      ...newPost,
      date: new Date().toISOString(),
    });
    setNewPost({
      title: '',
      author: '',
      category: '',
      content: '',
      excerpt: '',
      status: 'Draft',
      image: null,
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Create New Blog Post</ModalHeader>
        <ModalBody>
          <Input
            label="Title"
            value={newPost.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Author"
            value={newPost.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Category"
            value={newPost.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Excerpt"
            value={newPost.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Content"
            value={newPost.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="mb-4"
            minRows={10}
          />
          <Select
            label="Status"
            value={newPost.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mb-4"
          >
            <SelectItem key="Draft" value="Draft" className="text-black dark:text-white">Draft</SelectItem>
            <SelectItem key="Published" value="Published" className="text-black dark:text-white">Published</SelectItem>
          </Select>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {newPost.image && (
            <img src={newPost.image} alt="Preview" className="max-w-full h-auto mb-4" />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Create Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBlogPostModal;