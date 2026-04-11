/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme color palette - Custom Palette
        theme: {
          'dark': '#1B4079',      // Yale Blue - Dark surfaces
          'medium': '#4D7C8A',    // Air Force Blue - Primary accents
          'light': '#7F9C96',     // Cambridge Blue - Borders and muted elements
          'lightest': '#CBDF90',  // Mindaro - Clean light background
        },
        // Accent colors - Custom Palette
        accent: {
          'blue': '#4D7C8A',      // Air Force Blue - Primary actions
          'cyan': '#CBDF90',      // Mindaro - Highlights and active states
          'light': '#8FAD88',     // Cambridge Blue - Subtle accents
          'mist': '#E3EBF2',      // Very light - Hover states
        },
        // Sidebar colors - Custom Palette
        sidebar: {
          'bg': '#1B4079',        // Yale Blue
          'text': '#FFFFFF',      // Pure white for maximum contrast
          'muted': '#7F9C96',     // Cambridge Blue for muted text
          'hover': '#4D7C8A',     // Air Force Blue - hover
          'active': '#4D7C8A',    // Air Force Blue - Active state
          DEFAULT: '#7F9C96',     // Cambridge Blue - Border/sidebar separator
        },
        // Navbar colors - Matching sidebar
        navbar: {
          'bg': '#1B4079',        // Yale Blue
          'text': '#FFFFFF',      // Pure white - Maximum readability
          'accent': '#CBDF90',    // Mindaro - Standout elements
          'hover': '#4D7C8A',     // Air Force Blue - Hover states
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

