import React, { useState, useEffect } from "react";
import {
  NextUIProvider,
  Card,
  Button,
  Tabs,
  Tab,
  Input,
  Spinner,
} from "@nextui-org/react";
import { ArrowRight, Bookmark, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import BlogsAPI from "../../services/blogs.api";
import UsersAPI from "../../services/users.api";
import { toast } from "react-hot-toast";

const UserBlogPage = () => {
  const [user, setUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);

    fetchBookmarks();
    fetchBlogPosts();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const bookmarks = await UsersAPI.getBookmarks();
      const bookmarkIds = bookmarks.map(bookmark => bookmark.blogId);
      setBookmarkedPosts(bookmarkIds);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      toast.error("Unable to fetch bookmarks");
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await BlogsAPI.getBlogs();
      const publishedPosts = posts.filter((post) => post.status === "Published");
      setBlogPosts(publishedPosts);
      setError(null);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("Failed to load blog posts");
      toast.error("Unable to fetch blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter(
    (post) =>
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "all" || bookmarkedPosts.includes(post.id))
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookmark = async (event, postId) => {
    if (event) {
      if (event.preventDefault) event.preventDefault();
      if (event.stopPropagation) event.stopPropagation();
    }

    try {
      if (bookmarkedPosts.includes(postId)) {
        await UsersAPI.removeBookmark(postId);
        setBookmarkedPosts((prev) => prev.filter((id) => id !== postId));
        toast.success("Bookmark removed");
      } else {
        await UsersAPI.addBookmark(postId);
        setBookmarkedPosts((prev) => [...prev, postId]);
        toast.success("Bookmark added");
      }
    } catch (err) {
      console.error("Error managing bookmark:", err);
      toast.error("Failed to manage bookmark");
    }
  };

  const handlePostClick = (postId, event) => {
    if (event) {
      if (event.preventDefault) event.preventDefault();
      if (event.stopPropagation) event.stopPropagation();
    }
    navigate(`/blog/${postId}`);
  };
  const FeaturedPost = ({ post }) => (
    <Card
      as="div"
      isPressable
      className="w-[700px] max-w-full bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white p-6 mb-8 cursor-pointer hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-2xl mx-auto lg:mx-0"
      onClick={(e) => handlePostClick(post.id, e)}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between relative w-full lg:space-x-6">
        <div className="w-full lg:w-full mb-4 lg:mb-0 h-48 lg:h-64 overflow-hidden">
          <img
            src={post.blog_image || "https://via.placeholder.com/600x400"}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-full lg:w-3/4 flex flex-col justify-between text-center">
          <div>
            <p className="text-sm mb-2">
              {new Date(post.createdAt).toLocaleDateString()} • Blog
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              {truncateText(post.title, 15)}
            </h2>
            <p className="mb-4">
              {truncateText(post.excerpt, 10)}
            </p>
          </div>
          <div className="flex items-center justify-center relative">
            <Button
              color="primary"
              endContent={<ArrowRight size={25} />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onPress={(e) => handlePostClick(post.id, e)}
            >
              Continue Reading
            </Button>
            <Button
              isIconOnly
              color="secondary"
              variant="light"
              onPress={(e) => handleBookmark(e, post.id)}
            >
              <Bookmark
                size={20}
                className={
                  bookmarkedPosts.includes(post.id)
                    ? "fill-current text-purple-500"
                    : ""
                }
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const BlogPostCard = ({ post }) => (
    <Card
      as="div"
      isPressable
      className="h-auto min-h-[24rem] lg:h-96 bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white p-3 cursor-pointer hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-xl flex flex-col w-full"
      onClick={(e) => handlePostClick(post.id, e)}
    >
      <div className="relative w-full pb-[56.25%] mb-4 overflow-hidden rounded-lg">
        <img
          src={post.blog_image || "https://via.placeholder.com/400x225"}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow flex flex-col text-center">
        <h3 className="text-lg lg:text-xl font-bold mb-2 line-clamp-2">
          {truncateText(post.title, 10)}
        </h3>
        <p className="mb-4 flex-grow line-clamp-2 text-gray-300">
          {truncateText(post.excerpt, 10)}
        </p>
        <div className="flex flex-col lg:flex-row items-center justify-between mt-auto w-full text-sm gap-2 lg:gap-20">
          <span className="text-gray-400 flex-shrink-0">
            {new Date(post.createdAt).toLocaleDateString()} • Blog
          </span>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={(e) => handlePostClick(post.id, e)}
              className="text-pink-500 hover:text-pink-600 transition-colors px-1"
            >
              Read More
            </button>
            <Button
              isIconOnly
              color="secondary"
              variant="light"
              onPress={(e) => handleBookmark(e, post.id)}
              className="hover:bg-gray-800 rounded-full transition-colors p-1"
            >
              <Bookmark
                size={26}
                className={
                  bookmarkedPosts.includes(post.id)
                    ? "fill-current text-purple-500"
                    : "text-gray-400"
                }
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" color="white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
        <div>
          <p className="text-2xl mb-4">{error}</p>
          <Button color="primary" onClick={fetchBlogPosts}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <NextUIProvider>
      <div className="space-y-6 p-4 lg:p-6 bg-black min-h-screen text-white pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-lg shadow-md mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            UniConnect Blog
          </h1>
          <p className="mb-4 text-white">
            Explore insights, tips, and stories from our community.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search posts or authors..."
            value={searchTerm}
            onChange={handleSearch}
            startContent={<Search className="text-gray-400" size={20} />}
            className="w-full sm:w-1/2"
          />
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
              className="overflow-hidden"
            >
              <div className="max-w-full overflow-x-hidden">
                <FeaturedPost post={filteredPosts[0]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredPosts.slice(1).map((post) => (
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