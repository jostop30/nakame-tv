/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0b0d12',
        card: '#161921',
        purple: { 500: '#a855f7', 600: '#9333ea' }
      }
    }
  },
  plugins: [],
}
