/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0f0f0f",
        "dark-text": "#e5e5e5",
        "dark-accent": "#6d28d9",
      },
    },
  },
  plugins: [],
};
