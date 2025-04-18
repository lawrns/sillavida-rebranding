/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'teal': {
          DEFAULT: '#1E5959', // Primary Brand Color
          'light': '#2A7A7A', // Hover states
          'dark': '#184747', // Active/pressed states
          'extralight': '#E5EDED', // Backgrounds, disabled states
        },
        'beige': {
          DEFAULT: '#E8DED1', // Secondary Brand Color
          'light': '#F5F0E8', // Hover states, lighter backgrounds
          'dark': '#D6C9B7', // Borders, dividers
          'extralight': '#FAF7F3', // Subtle backgrounds
        },
        // Accent Colors
        'sage': {
          DEFAULT: '#7D9D8C', // Primary Accent Color
          'light': '#9CBCAB', // Hover states
          'dark': '#5E7A6A', // Active/pressed states
          'extralight': '#EDF3F0', // Backgrounds, disabled states
        },
        'terracotta': {
          DEFAULT: '#C87D55', // Secondary Accent Color
          'light': '#D69A7A', // Hover states
          'dark': '#A66240', // Active/pressed states
          'extralight': '#F7EDE7', // Backgrounds, subtle accents
        },
        // Neutral Colors (extending existing Tailwind grays)
        'gray': {
          'dark': '#495057', // Secondary text
          'medium': '#6C757D', // Tertiary text, disabled text
          'light': '#ADB5BD', // Borders, dividers
          'extralight': '#E9ECEF', // Backgrounds, disabled elements
        },
        // Functional Colors
        'success': {
          DEFAULT: '#2E7D32',
          'light': '#4CAF50',
          'dark': '#1B5E20',
          'extralight': '#E8F5E9',
        },
        'warning': {
          DEFAULT: '#F9A825',
          'light': '#FBC02D',
          'dark': '#F57F17',
          'extralight': '#FFF8E1',
        },
        'error': {
          DEFAULT: '#C62828',
          'light': '#E53935',
          'dark': '#B71C1C',
          'extralight': '#FFEBEE',
        },
        'info': {
          DEFAULT: '#0277BD',
          'light': '#039BE5',
          'dark': '#01579B',
          'extralight': '#E1F5FE',
        },
      },
      // Add custom box shadows
      boxShadow: {
        'card': '0 2px 8px rgba(33, 37, 41, 0.1)',
        'card-hover': '0 4px 12px rgba(33, 37, 41, 0.15)',
      },
    },
  },
  plugins: [],
};
