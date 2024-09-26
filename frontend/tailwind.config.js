/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgPrimary:"#f7f8f9",
        primary:"#222222",
        accent:"34495E",
      }
    },
  },
  plugins: [],
}

