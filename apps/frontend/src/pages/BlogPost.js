import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Switch } from "@nextui-org/react";
import { ArrowLeft, Sun, Moon } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      const foundPost = posts.find(p => p.id === parseInt(id));
      setPost(foundPost);
    }

    const darkModePreference = localStorage.getItem('darkMode');
    setIsDarkMode(darkModePreference === 'true');
  }, [id]);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  if (!post) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/blog" className="flex items-center text-primary hover:underline">
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>
          <Switch
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            size="lg"
            color="secondary"
            startContent={<Sun />}
            endContent={<Moon />}
          />
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <img 
            src={post.image || 'https://via.placeholder.com/1200x400'} 
            alt={post.title} 
            className="w-full h-64 object-cover"
          />
          <CardHeader className="flex flex-col items-start p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-4">By {post.author}</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardBody>
          <CardFooter className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
            <Chip color="primary" variant="flat">{post.category}</Chip>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(post.date).toLocaleString()}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;