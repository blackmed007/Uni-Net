import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@nextui-org/react";
import { Calendar, User, Tag, FileText } from "lucide-react";

const BlogPostDetailModal = ({ isOpen, onClose, post }) => {
  if (!post) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-black dark:text-white">{post.title}</h2>
          <p className="text-default-500">By {post.author}</p>
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Date</p>
                    <p className="font-medium text-black dark:text-white">{post.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Author</p>
                    <p className="font-medium text-black dark:text-white">{post.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Category</p>
                    <p className="font-medium text-black dark:text-white">{post.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-default-500">Status</p>
                    <p className="font-medium text-black dark:text-white">{post.status}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Content</h3>
            <div className="prose dark:prose-invert max-w-none text-black dark:text-white" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => console.log("Edit post")}>
            Edit Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BlogPostDetailModal;