import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, useDisclosure, Pagination } from "@nextui-org/react";
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
  const [blogPosts, setBlogPosts] = useState([]);
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
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of blog posts per page

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isPostDetailOpen, onOpen: onPostDetailOpen, onClose: onPostDetailClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Memoized filtered posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAuthor = !filters.author || post.author === filters.author;
      const matchesCategory = !filters.category || post.category === filters.category;
      const matchesStatus = !filters.status || post.status === filters.status;

      const postDate = new Date(post.createdAt);
      const matchesStartDate = !filters.startDate || postDate >= new Date(filters.startDate);
      const matchesEndDate = !filters.endDate || postDate <= new Date(filters.endDate);

      return (
        matchesSearch &&
        matchesAuthor &&
        matchesCategory &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [blogPosts, searchTerm, filters]);

  // Ensure current page is valid when filtered posts change
  useEffect(() => {
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filteredPosts, itemsPerPage, currentPage]);

  // Memoized current posts for pagination
  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const response = await BlogsAPI.getBlogs();
      setBlogPosts(response);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
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
        setIsLoading(true);
        await BlogsAPI.deleteBlog(selectedPost.id);
        await fetchBlogPosts();
        toast.success('Blog post deleted successfully');
        onConfirmClose();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      setIsLoading(true);
      await BlogsAPI.createBlog(postData);
      await fetchBlogPosts();
      onCreateClose();
      toast.success('Blog post created successfully');
    } catch (error) {
      console.error('Error creating blog post:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create blog post');
      }
      // Propagate error to modal for handling
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      setIsLoading(true);
      await BlogsAPI.updateBlog(updatedPost.id, updatedPost);
      await fetchBlogPosts();
      onEditClose();
      toast.success('Blog post updated successfully');
    } catch (error) {
      console.error('Error updating blog post:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update blog post');
      }
      // Propagate error to modal for handling
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBlog = () => {
    window.open('/blog', '_blank');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <Button 
          color="primary" 
          onPress={onFilterOpen} 
          startContent={<Filter size={20} />}
          isDisabled={isLoading}
        >
          Filters
        </Button>
        <Button 
          color="success" 
          onPress={onCreateOpen} 
          startContent={<Plus size={20} />}
          isDisabled={isLoading}
        >
          Create Post
        </Button>
        <Button 
          color="secondary" 
          onPress={handleViewBlog} 
          startContent={<Eye size={20} />}
        >
          View Blog
        </Button>
      </div>
      <BlogPostListTable
        blogPosts={currentPosts}
        searchTerm={searchTerm}
        filters={filters}
        onPostAction={handlePostAction}
        formatDate={formatDate}
        isLoading={isLoading}
      />
      
      {/* Pagination section */}
      <div className="flex justify-center mt-4">
        <Pagination
          total={Math.ceil(filteredPosts.length / itemsPerPage)}
          page={currentPage}
          onChange={setCurrentPage}
          color="primary"
          showControls
          showShadow
          variant="flat"
          isDisabled={filteredPosts.length <= itemsPerPage}
        />
      </div>

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