import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { Search, Filter, Plus } from "lucide-react";
import BlogPostListTable from '../../components/admin/blog/BlogPostListTable';
import BlogPostDetailModal from '../../components/admin/blog/BlogPostDetailModal';
import FilterModal from '../../components/common/FilterModal';
import CreateBlogPostModal from '../../components/admin/blog/CreateBlogPostModal';
import EditBlogPostModal from '../../components/admin/blog/EditBlogPostModal';
import ConfirmActionModal from '../../components/common/ConfirmActionModal';

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    category: '',
    status: '',
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionType, setActionType] = useState('');
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isPostDetailOpen, onOpen: onPostDetailOpen, onClose: onPostDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  useEffect(() => {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      setBlogPosts(JSON.parse(storedPosts));
    }
  }, []);

  const saveBlogPosts = (updatedPosts) => {
    setBlogPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    onFilterClose();
  };

  const handlePostAction = (action, post) => {
    setSelectedPost(post);
    setActionType(action);
    switch (action) {
      case 'view':
        onPostDetailOpen();
        break;
      case 'edit':
        onEditOpen();
        break;
      case 'delete':
        onConfirmOpen();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmAction = () => {
    if (actionType === 'delete') {
      const updatedPosts = blogPosts.filter(post => post.id !== selectedPost.id);
      saveBlogPosts(updatedPosts);
    }
    onConfirmClose();
  };

  const handleEditPost = (updatedPost) => {
    const updatedPosts = blogPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    saveBlogPosts(updatedPosts);
    onEditClose();
  };

  const handleCreatePost = (newPost) => {
    const postWithId = { ...newPost, id: Date.now() };
    const updatedPosts = [...blogPosts, postWithId];
    saveBlogPosts(updatedPosts);
    onCreateClose();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Blog Management</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={handleSearch}
          startContent={<Search className="text-gray-400" size={20} />}
          className="w-full sm:w-1/2"
        />
        <Button color="primary" onPress={onFilterOpen} startContent={<Filter size={20} />}>
          Filters
        </Button>
        <Button color="success" onPress={onCreateOpen} startContent={<Plus size={20} />}>
          Create Post
        </Button>
      </div>
      <BlogPostListTable
        blogPosts={blogPosts}
        searchTerm={searchTerm}
        filters={filters}
        onPostAction={handlePostAction}
      />
      <BlogPostDetailModal
        isOpen={isPostDetailOpen}
        onClose={onPostDetailClose}
        post={selectedPost}
      />
      <FilterModal
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={handleFilter}
        initialFilters={filters}
      />
      <CreateBlogPostModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSave={handleCreatePost}
      />
      <EditBlogPostModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        post={selectedPost}
        onSave={handleEditPost}
      />
      <ConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
      />
    </div>
  );
};

export default BlogManagement;