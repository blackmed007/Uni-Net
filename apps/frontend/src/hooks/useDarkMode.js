import { useState, useEffect } from 'react';

const useDarkMode = () => {
  // Always initialize as dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Effect to enforce dark mode
  useEffect(() => {
    try {
      // Force dark mode in localStorage
      localStorage.setItem('darkMode', 'true');
      
      // Force dark mode classes and attributes
      const root = window.document.documentElement;
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      root.setAttribute('data-theme', 'dark');
      
      // Set dark mode CSS variables
      document.body.style.setProperty('--background-color', '#000000');
      document.body.style.setProperty('--text-color', '#ffffff');
      
      // Force NextUI dark theme
      document.documentElement.setAttribute('data-nextui-theme', 'dark');
    } catch (error) {
      console.error('Error setting dark mode:', error);
    }
  }, []);

  // Toggle function that maintains dark mode
  const toggleDarkMode = () => {
    // Keep dark mode enabled
    setIsDarkMode(true);
  };

  return [true, toggleDarkMode]; // Always return true for isDarkMode
};

export default useDarkMode;