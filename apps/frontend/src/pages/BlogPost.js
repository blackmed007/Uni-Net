import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import BlogsAPI from "../services/blogs.api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      const fetchedPost = await BlogsAPI.getBlog(id);

      if (!fetchedPost) {
        toast.error("Blog post not found");
        navigate("/blog");
        return;
      }

      setPost(fetchedPost);

      // Increment view count
      try {
        const updatedPost = await BlogsAPI.incrementViews(id);
        setPost((prev) => ({
          ...prev,
          views: updatedPost.views,
        }));
      } catch (error) {
        console.error("Error incrementing views:", error);
        // Don't show error to user as this is not critical
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to load blog post");
      navigate("/blog");
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

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Blog post not found</h2>
          <Link to="/blog">
            <Button color="primary" startContent={<ArrowLeft size={20} />}>
              Return to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-96 overflow-hidden mb-8">
        <img
          src={post.blog_image || "https://via.placeholder.com/1200x400"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <img
                  src={
                    post.author_profile_url || "https://via.placeholder.com/48"
                  }
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-white text-lg">{truncateText(post.author, 20)}</p>
                <p className="text-sm text-gray-300">{formatDate(post.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>
        <Card className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-2xl overflow-hidden">
          <CardBody className="p-8">
            <div
              className="prose prose-invert prose-lg max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardBody>
          <CardFooter className="flex justify-between items-center p-6 border-t border-gray-800">
            <div className="flex items-center space-x-4">
              <Chip
                color="primary"
                variant="flat"
                className="bg-blue-600 text-white"
              >
                {truncateText(post.category, 15)}
              </Chip>
              <div className="text-sm text-gray-400">
                {post.views} view{post.views !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {formatDate(post.createdAt)}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;