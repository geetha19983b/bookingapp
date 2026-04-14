/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coolors Palette
        eggshell: '#F4F1DE',      // Eggshell - backgrounds
        peach: '#E07A5F',         // Burnt Peach - accents, buttons
        indigo: '#3D405B',        // Twilight Indigo - dark surfaces, text
        teal: '#81B29A',          // Muted Teal - highlights, secondary
        apricot: '#F2CC8F',       // Apricot Cream - highlights, cards
        // Semantic groupings for convenience
        theme: {
          'bg': '#F4F1DE',        // Main background
          'primary': '#3D405B',   // Main text, dark surfaces
          'accent': '#E07A5F',    // Accent, buttons
          'secondary': '#81B29A', // Secondary, highlights
          'highlight': '#F2CC8F', // Cards, highlights
        },
        sidebar: {
          'bg': '#3D405B',        // Sidebar background
          'text': '#F4F1DE',      // Sidebar text
          'active': '#E07A5F',    // Active/selected
          'hover': '#81B29A',     // Hover state
        },
        navbar: {
          'bg': '#3D405B',        // Navbar background
          'text': '#F4F1DE',      // Navbar text
          'accent': '#E07A5F',    // Navbar accent
          'hover': '#81B29A',     // Navbar hover
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

