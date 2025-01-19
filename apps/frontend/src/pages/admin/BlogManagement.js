import React, { useState, useEffect } from 'react';
import { Input, Button, useDisclosure, Spinner } from "@nextui-org/react";
import { Search, Filter, Plus, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BlogPostListTable from '../../components/admin/blog/BlogPostListTable';
import BlogPostDetailModal from '../../components/admin/blog/BlogPostDetailModal';
import BlogFilterModal from '../../components/admin/blog/BlogFilterModal';
import CreateBlogPostModal from '../../components/admin/blog/CreateBlogPostModal';
import EditBlogPostModal from '../../components/admin/blog/EditBlogPostModal';
import BlogConfirmActionModal from '../../components/admin/blog/BlogConfirmActionModal';
import BlogsAPI from '../../services/blogs.api';
import { toast } from 'react-hot-toast';

const BlogManagement = () => {
  // State management
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    category: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionType, setActionType] = useState('');

  // Modal controls
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isPostDetailOpen, onOpen: onPostDetailOpen, onClose: onPostDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  
  const navigate = useNavigate();

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await BlogsAPI.getBlogs();
      setBlogPosts(posts);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleConfirmAction = async () => {
    if (actionType === 'delete') {
      try {
        await BlogsAPI.deleteBlog(selectedPost.id);
        toast.success('Blog post deleted successfully');
        await fetchBlogPosts(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete blog post');
        console.error('Error deleting blog post:', error);
      }
    }
    onConfirmClose();
  };

  const handleEditPost = async (updatedPost) => {
    try {
      await BlogsAPI.updateBlog(updatedPost.id, updatedPost);
      toast.success('Blog post updated successfully');
      await fetchBlogPosts(); // Refresh the list
      onEditClose();
    } catch (error) {
      toast.error('Failed to update blog post');
      console.error('Error updating blog post:', error);
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      await BlogsAPI.createBlog(newPost);
      toast.success('Blog post created successfully');
      await fetchBlogPosts(); // Refresh the list
      onCreateClose();
    } catch (error) {
      toast.error('Failed to create blog post');
      console.error('Error creating blog post:', error);
    }
  };

  const handleViewBlog = () => {
    window.open('/blog', '_blank');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

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
        <Button color="secondary" onPress={handleViewBlog} startContent={<Eye size={20} />}>
          View Blog
        </Button>
      </div>
      <BlogPostListTable
        blogPosts={blogPosts}
        searchTerm={searchTerm}
        filters={filters}
        onPostAction={handlePostAction}
        formatDate={formatDate}
      />
      <BlogPostDetailModal
        isOpen={isPostDetailOpen}
        onClose={onPostDetailClose}
        post={selectedPost}
        formatDate={formatDate}
      />
      <BlogFilterModal
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
      <BlogConfirmActionModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
      />
    </div>
  );
};

export default BlogManagement;