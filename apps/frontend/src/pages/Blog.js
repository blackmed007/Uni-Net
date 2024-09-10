import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Chip, Switch } from "@nextui-org/react";
import { Search, Sun, Moon } from "lucide-react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts);
      const publishedPosts = allPosts.filter(post => post.status === 'Published');
      setPosts(publishedPosts);
    }
    
    const darkModePreference = localStorage.getItem('darkMode');
    setIsDarkMode(darkModePreference === 'true');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">EduConnect Blog</h1>
          <Switch
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            size="lg"
            color="secondary"
            startContent={<Sun />}
            endContent={<Moon />}
          />
        </div>
        <div className="mb-8">
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="text-gray-400" size={20} />}
            className="max-w-md mx-auto"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Card key={post.id} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={post.image || 'https://via.placeholder.com/300x200'} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <CardHeader className="flex flex-col items-start p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{post.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-4">By {post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              </CardBody>
              <CardFooter className="flex justify-between items-center p-6">
                <Chip color="primary" variant="flat">{post.category}</Chip>
                <Link to={`/blog/${post.id}`}>
                  <Button color="primary" variant="flat">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No blog posts found. Try a different search term.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;