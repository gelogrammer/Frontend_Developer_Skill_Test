/** @type {import('tailwindcss').Config} */
module.exports = {
  // Files to scan for Tailwind class usage
  content: [
    "./src/**/*.{html,ts}",  // Scans all HTML and TypeScript files in src directory
  ],
  theme: {
    extend: {
      // Custom theme extensions
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Sets Inter as the primary font with sans-serif fallback
      },
    },
  },
  plugins: [],  // No additional Tailwind plugins used
} 