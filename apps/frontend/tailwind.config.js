const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF1493", // Dark pink
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          // Ensure dark theme is the default and only theme
          colors: {
            background: '#000000',
            foreground: '#ffffff',
            primary: {
              DEFAULT: '#FF1493',
            },
          },
        },
      },
    }),
  ],
};