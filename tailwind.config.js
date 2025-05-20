/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1d9bf0',
          hover: '#1a8cd8',
          dark: '#15202b',
          darker: '#1a2734',
          darkest: '#253341',
          border: '#38444d',
        },
      },
    },
  },
  plugins: [],
};