import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      const foundPost = posts.find(p => p.id === id);
      if (foundPost) {
        // Increment views
        foundPost.views += 1;
        // Update localStorage
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        setPost(foundPost);
      }
    }
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-96 overflow-hidden mb-8">
        <img 
          src={post.image || 'https://via.placeholder.com/1200x400'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{post.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <img 
                  src={post.authorImage || 'https://via.placeholder.com/48'} 
                  alt={post.author} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-white text-lg">{post.author}</p>
                <p className="text-sm text-gray-300">{formatDate(post.date)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Link to="/blog" className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors duration-200 mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>
        <Card className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-2xl overflow-hidden">
          <CardBody className="p-8">
            <div className="prose prose-invert prose-lg max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardBody>
          <CardFooter className="flex justify-between items-center p-6 border-t border-gray-800">
            <div className="flex items-center space-x-4">
              <Chip color="primary" variant="flat" className="bg-blue-600 text-white">{post.category}</Chip>
              <div className="text-sm text-gray-400">
                {post.views} view{post.views !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {formatDate(post.date)}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;