import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Facebook, Twitter, Linkedin, Link, Mail, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';

const EventShareModal = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !event) return null;

  const shareUrl = `${window.location.origin}/event/${event.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Check out this event: ${event.name}`)}&body=${encodeURIComponent(`I thought you might be interested in this event: ${shareUrl}`)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 bg-opacity-50 backdrop-blur-md border border-gray-800",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
        closeButton: "hover:bg-white/5 active:bg-white/10"
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600"
          >
            Share Event
          </motion.h2>
        </ModalHeader>
        <ModalBody>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300"
          >
            Share this event with your friends:
          </motion.p>
          <motion.div 
            className="flex justify-around my-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {['facebook', 'twitter', 'linkedin', 'email'].map((platform) => (
  <motion.div 
    key={platform}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Button 
      isIconOnly 
      color="primary" 
      variant="flat" 
      className={`
        ${platform === 'facebook' ? 'text-blue-600' : ''}
        ${platform === 'twitter' ? 'text-blue-400' : ''}
        ${platform === 'linkedin' ? 'text-blue-700' : ''}
        ${platform === 'email' ? 'text-red-500' : ''}
      `}
      onClick={() => handleShare(platform)}
    >
      {platform === 'facebook' && <Facebook />}
      {platform === 'twitter' && <Twitter />}
      {platform === 'linkedin' && <Linkedin />}
      {platform === 'email' && <Mail />}
    </Button>
  </motion.div>
))}
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Input
              readOnly
              value={shareUrl}
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-white bg-gray-800 hover:bg-gray-800/80"
              }}
            />
            <Button 
              color="primary" 
              onClick={handleCopyLink}
              className="min-w-[64px]"
            >
              {copied ? 'Copied!' : <Link size={20} />}
            </Button>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
  );
};

EventShareModal.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventShareModal;