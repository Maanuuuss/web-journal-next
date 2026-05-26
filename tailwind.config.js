/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // 👈 IMPORTANTÍSIMO
    "./components/**/*.{js,ts,jsx,tsx}", // si tienes carpeta components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
