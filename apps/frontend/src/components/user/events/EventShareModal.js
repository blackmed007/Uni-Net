import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Facebook, Twitter, Linkedin, Link } from "lucide-react";

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
      default:
        return;
    }
    window.open(url, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Share Event</ModalHeader>
        <ModalBody>
          <p>Share this event with your friends:</p>
          <div className="flex justify-around my-4">
            <Button isIconOnly color="primary" variant="flat" onClick={() => handleShare('facebook')}>
              <Facebook />
            </Button>
            <Button isIconOnly color="primary" variant="flat" onClick={() => handleShare('twitter')}>
              <Twitter />
            </Button>
            <Button isIconOnly color="primary" variant="flat" onClick={() => handleShare('linkedin')}>
              <Linkedin />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={shareUrl}
              className="flex-grow"
            />
            <Button color="primary" onClick={handleCopyLink}>
              {copied ? 'Copied!' : <Link size={20} />}
            </Button>
          </div>
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

export default EventShareModal;