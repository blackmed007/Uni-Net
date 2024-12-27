import React, { useState } from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Button, 
  NavbarMenu, 
  NavbarMenuItem, 
  NavbarMenuToggle 
} from "@nextui-org/react";

// Navigation items configuration for both desktop and mobile menus
const MENU_ITEMS = [
  { text: "Our Story", href: "#our-story", isExternal: false },
  { text: "Join Our Team", href: "https://github.com/0xk3v/uninet", isExternal: true },
  { text: "Blog", href: "/blog", isExternal: true }
];

const Header = () => {
  // Controls mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };
  // Handles smooth scrolling for anchor links and closes mobile menu
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Navbar 
      shouldHideOnScroll 
      className="bg-black"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={handleMenuToggle}
    >
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarBrand>
        <Link href="/" color="Foreground" onClick={handleMenuItemClick}>
          <img src="assets/home/main-logo.avif" alt="Logo" className="w-8 h-8" />
          <p className="font-bold text-inherit">UniLife</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {MENU_ITEMS.map(({ text, href, isExternal }) => (
          <NavbarItem key={text}>
            <Link 
              color="Foreground" 
              href={href}
              onClick={!isExternal ? (e) => handleScrollToSection(e, 'our-story') : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {text}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-black sm:hidden">
        {MENU_ITEMS.map(({ text, href, isExternal }) => (
          <NavbarMenuItem key={text}>
            <Link 
              color="foreground" 
              href={href}
              onClick={!isExternal ? 
                (e) => handleScrollToSection(e, 'our-story') : 
                handleMenuItemClick
              }
              target={isExternal ? "_blank" : undefined}
            >
              {text}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link 
            color="foreground" 
            href="/login"
            onClick={handleMenuItemClick}
          >
            Login
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;