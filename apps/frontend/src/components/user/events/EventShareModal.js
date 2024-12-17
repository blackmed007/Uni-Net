import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Facebook, Twitter, Linkedin, Link, Mail, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';

const EventShareModal = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const shareUrl = `${window.location.origin}/event/${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    let url;
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this event: ${event.name}`)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(event.name)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`Check out this event: ${event.name} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Check out this event: ${event.name}`)}&body=${encodeURIComponent(`I thought you might be interested in this event: ${shareUrl}`)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          motionProps={{
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit"
          }}
        >
          <ModalContent className="bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800">
            <ModalHeader className="flex flex-col gap-1">
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600"
              >
                Share Event
              </motion.h2>
            </ModalHeader>
            <ModalBody>
              <motion.p
                variants={itemVariants}
                className="text-gray-300"
              >
                Share this event with your friends:
              </motion.p>
              <motion.div 
                className="flex justify-around my-6"
                variants={itemVariants}
              >
                {['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'].map((platform) => (
                  <motion.div key={platform} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button isIconOnly color="primary" variant="flat" onClick={() => handleShare(platform)}>
                      {platform === 'facebook' && <Facebook />}
                      {platform === 'twitter' && <Twitter />}
                      {platform === 'linkedin' && <Linkedin />}
                      {platform === 'whatsapp' && <Share2 />}
                      {platform === 'email' && <Mail />}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 mb-6"
                variants={itemVariants}
              >
                <Input
                  readOnly
                  value={shareUrl}
                  className="flex-grow bg-gray-800 text-white"
                />
                <Button color="primary" onClick={handleCopyLink}>
                  {copied ? 'Copied!' : <Link size={20} />}
                </Button>
              </motion.div>
              <motion.div
                className="flex justify-center"
                variants={itemVariants}
              >
                <QRCodeSVG value={shareUrl} size={200} />
              </motion.div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default EventShareModal;