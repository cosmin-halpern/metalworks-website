/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF3366', // Vibrant Pink
          light: '#FF6699',
          dark: '#CC0033',
        },
        secondary: {
          DEFAULT: '#33CC99', // Mint Green
          light: '#66FFCC',
          dark: '#009973',
        },
        accent: {
          DEFAULT: '#FFCC00', // Bright Yellow
          light: '#FFE066',
          dark: '#CC9900',
        },
        background: {
          DEFAULT: '#F0F8FF', // Light Blue
          dark: '#E6F0FF',
        },
        text: {
          DEFAULT: '#2D3748', // Dark Gray
          light: '#4A5568',
          dark: '#1A202C',
        },
      },
    },
  },
  plugins: [],
}
