import React, { useState, useEffect } from 'react';
import { NextUIProvider, Input, Card, CardBody, CardHeader, CardFooter, Button, Pagination } from "@nextui-org/react";
import { Search } from "lucide-react";

const UserBlogPage = () => {
  const [user, setUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);

    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setBlogPosts(storedPosts);
  }, []);

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <NextUIProvider>
      <div>
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <Input
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="text-gray-400" size={20} />}
          className="mb-6"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentPosts.map(post => (
            <Card key={post.id} className="bg-white dark:bg-gray-800">
              <CardHeader>
                <h2 className="text-xl font-semibold">{post.title}</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              </CardBody>
              <CardFooter>
                <Button color="primary" variant="flat">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Pagination
          total={Math.ceil(filteredPosts.length / postsPerPage)}
          page={currentPage}
          onChange={paginate}
          className="flex justify-center"
        />
      </div>
    </NextUIProvider>
  );
};

export default UserBlogPage;