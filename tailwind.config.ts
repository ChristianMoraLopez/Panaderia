
/* tailwind.config.js */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bohemian': ['"Bohemian Soul"', 'serif'],
        'edgecutting': ['Edgecutting', 'sans-serif'],
      },
      colors: {
        'beauty-pink': '#FF69B4',
        'beauty-gold': '#FFD700',
      },
    },
  },
  plugins: [],
}
