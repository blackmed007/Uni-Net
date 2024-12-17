import React, { useState, useEffect } from 'react';
import { NextUIProvider, Card, Button, Tabs, Tab, Input } from "@nextui-org/react";
import { ArrowRight, Bookmark, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

const UserBlogPage = () => {
  const [user, setUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);

    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setBlogPosts(storedPosts);

    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    setBookmarkedPosts(storedBookmarks);
  }, []);

  const filteredPosts = blogPosts.filter(post => 
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     post.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === 'all' || bookmarkedPosts.includes(post.id))
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookmark = (e, postId) => {
    e.stopPropagation();
    setBookmarkedPosts(prev => {
      const updatedBookmarks = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  const handlePostClick = (postId) => {
    window.open(`/blog/${postId}`, '_blank');
  };

  const FeaturedPost = ({ post }) => (
    <Card 
      isPressable
      className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white p-6 mb-8 cursor-pointer hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-2xl"
      onClick={() => handlePostClick(post.id)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 mb-4 md:mb-0 md:mr-6">
          <img src={post.image || 'https://via.placeholder.com/600x400'} alt={post.title} className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <p className="text-sm mb-2">{new Date(post.date).toLocaleDateString()} • Blog</p>
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
            <p className="mb-4">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-center relative">
            <Button 
              color="primary"
              endContent={<ArrowRight size={16} />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                handlePostClick(post.id);
              }}
            >
              Continue Reading
            </Button>
            <Button
              isIconOnly
              color="secondary"
              variant="light"
              onClick={(e) => handleBookmark(e, post.id)}
              className="absolute right-0"
            >
              <Bookmark 
                size={20} 
                className={bookmarkedPosts.includes(post.id) ? "fill-current text-purple-500" : ""}
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const BlogPostCard = ({ post }) => (
    <Card 
      isPressable
      className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white p-4 cursor-pointer hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-xl"
      onClick={() => handlePostClick(post.id)}
    >
      <div className="flex flex-col h-full">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <img src={post.image || 'https://via.placeholder.com/400x200'} alt={post.title} className="w-full h-full object-cover rounded-lg" />
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="mb-4 flex-grow line-clamp-2">{post.excerpt}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-sm">{new Date(post.date).toLocaleDateString()} • Blog</p>
          <div className="flex items-center space-x-2">
            <Button 
              color="primary" 
              size="sm" 
              variant="light"
              className="px-0"
              onClick={(e) => {
                e.stopPropagation();
                handlePostClick(post.id);
              }}
            >
              Read More
            </Button>
            <Button
              isIconOnly
              color="secondary"
              variant="light"
              size="sm"
              onClick={(e) => handleBookmark(e, post.id)}
            >
              <Bookmark 
                size={16} 
                className={bookmarkedPosts.includes(post.id) ? "fill-current text-purple-500" : ""}
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <NextUIProvider>
      <div className="space-y-6 p-6 bg-black min-h-screen text-white pt-24">
      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-lg shadow-md mb-8"
>
  <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
    UniConnect Blog
  </h1>
  <p className="mb-4 text-white">
    Explore insights, tips, and stories from our community.
  </p>
</motion.div>


        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-grow max-w-xl">
            <Input
              placeholder="Search posts or authors..."
              value={searchTerm}
              onChange={handleSearch}
              startContent={<Search className="text-gray-400" size={20} />}
              className="w-full bg-gray-900 text-white border-none"
            />
          </div>
        </div>

        <Tabs 
          aria-label="Blog categories" 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-6"
          color="secondary"
          variant="underlined"
        >
          <Tab key="all" title="All Posts" />
          <Tab key="bookmarked" title="Bookmarked Posts" />
        </Tabs>

        <AnimatePresence>
          {filteredPosts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-400"
            >
              No blog posts found.
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeaturedPost post={filteredPosts[0]} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.slice(1).map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NextUIProvider>
  );
};

export default UserBlogPage;