import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import BlogsAPI from "../services/blogs.api";
import { toast } from "react-hot-toast";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const allPosts = await BlogsAPI.getBlogs();
      // Filter published posts
      const publishedPosts = allPosts.filter(
        (post) => post.status === "Published",
      );
      setPosts(publishedPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          UniConnect Blog
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-64 bg-gray-800">
                <img
                  src={post.blog_image || "https://via.placeholder.com/400x300"}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Chip
                    color="primary"
                    variant="flat"
                    className="bg-blue-600 text-white"
                  >
                    {truncateText(post.category, 12)}
                  </Chip>
                </div>
              </div>
              <CardHeader className="flex flex-col items-start p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white hover:text-blue-400 transition-colors duration-200">
                  {truncateText(post.title, 20)}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={
                        post.author_profile_url ||
                        "https://via.placeholder.com/40"
                      }
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {truncateText(post.author, 20)}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <p className="text-gray-300 line-clamp-3">
                  {truncateText(post.excerpt, 100)}
                </p>
              </CardBody>
              <CardFooter className="flex justify-between items-center p-6">
                <span className="text-sm text-gray-400">
                  {post.views} view{post.views !== 1 ? "s" : ""}
                </span>
                <Link to={`/blog/${post.id}`}>
                  <Button
                    color="primary"
                    endContent={<ArrowRight size={16} />}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No blog posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;