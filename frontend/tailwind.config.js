/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme color palette - Professional Dark (Modern premium dark theme)
        theme: {
          'dark': '#1C344E',      // Deep navy - Dark surfaces
          'medium': '#286A8C',    // Rich teal - Primary accents
          'light': '#C4CDD2',     // Soft gray-blue - Borders and muted elements
          'lightest': '#F0F4F8',  // Clean light background
        },
        // Accent colors - Vibrant and Modern
        accent: {
          'blue': '#428BB5',      // Bright medium blue - Primary actions
          'cyan': '#5EAECD',      // Vibrant cyan - Highlights and active states
          'light': '#C4CDD2',     // Light gray-blue - Subtle accents
          'mist': '#E3EBF2',      // Very light - Hover states
        },
        // Sidebar colors - Dark and Professional
        sidebar: {
          'bg': '#1C344E',        // Deep navy
          'text': '#FFFFFF',      // Pure white for maximum contrast
          'muted': '#D8E2EA',     // Light gray-blue for muted text
          'hover': '#254461',     // Slightly lighter on hover
          'active': '#428BB5',    // Bright blue - Active state
          DEFAULT: '#2A4A62',     // Border/sidebar separator
        },
        // Navbar colors - Matching sidebar
        navbar: {
          'bg': '#1C344E',        // Deep navy
          'text': '#FFFFFF',      // Pure white - Maximum readability
          'accent': '#5EAECD',    // Vibrant cyan - Standout elements
          'hover': '#254461',     // Slightly lighter - Hover states
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

