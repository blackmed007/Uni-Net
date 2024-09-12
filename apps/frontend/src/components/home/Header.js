import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

const Header = () => {
  return (
    <Navbar shouldHideOnScroll className="bg-black">
      <NavbarBrand>
      <Link href="/" color="Foreground">
        <img src="assets/home/main-logo.avif" alt="Logo" className="w-8 h-8" />
        <p className="font-bold text-inherit">UniLife</p>
        </Link>

      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="Foreground" href="#our-story">
            Our Story
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="Foreground" href="#join-team">
            Join Our Team
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="Foreground" href="/blog">
            Blog
          </Link>
        </NavbarItem>
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
    </Navbar>
  );
};

export default Header;