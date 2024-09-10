import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

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
    onSave(editedPost);
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
        <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">Edit Blog Post</ModalHeader>
        <ModalBody>
          <Input
            label="Title"
            value={editedPost.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Author"
            value={editedPost.author || ''}
            onChange={(e) => handleChange('author', e.target.value)}
            className="mb-4"
          />
          <Input
            label="Category"
            value={editedPost.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Excerpt"
            value={editedPost.excerpt || ''}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Content"
            value={editedPost.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            className="mb-4"
            minRows={10}
          />
          <Select
            label="Status"
            selectedKeys={editedPost.status ? [editedPost.status] : []}
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
          {editedPost.image && (
            <img src={editedPost.image} alt="Preview" className="max-w-full h-auto mb-4" />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBlogPostModal;