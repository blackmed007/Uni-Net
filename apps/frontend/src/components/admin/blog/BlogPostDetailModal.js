import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { Calendar, User, Tag, FileText, Eye } from "lucide-react";
import { motion } from "framer-motion";

const BlogPostDetailModal = ({ isOpen, onClose, post, formatDate }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (!post) return null;

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/800x400?text=No+Image+Available";
    setIsImageLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800 rounded-3xl",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            {post.title}
          </motion.h2>
          <p className="text-gray-400">#{post.id}</p>
        </ModalHeader>
        <ModalBody>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {post.image && (
              <div className="relative w-full h-48 mb-4">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <Spinner color="white" />
                  </div>
                )}
                <img
                  src={post.blog_image}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: isImageLoading ? "none" : "block" }}
                />
              </div>
            )}
            <Card className="bg-gray-800 border border-gray-700 mb-6">
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 col-span-2">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={
                          post.author_profile_url ||
                          "https://via.placeholder.com/64"
                        }
                        alt={post.author}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64?text=Author";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{post.author}</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="text-green-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium text-white">{post.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="text-yellow-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-medium text-white">{post.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="text-pink-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Views</p>
                      <p className="font-medium text-white">
                        {post.views} view{post.views !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-blue-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="font-medium text-white">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Excerpt</h3>
              <p className="text-gray-300">{post.excerpt}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Content</h3>
              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BlogPostDetailModal;
