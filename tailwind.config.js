/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        light: "#F0F4FF",
         freshGreen: "#3E7C4A",
         midnight: "#0F172A",
        blueSlate: "#1E293B",
        electricBlue: "#3B82F6",
        skyNeon: "#60A5FA",
        coolGray: "#94A3B8",
        aquaGreen: "#2DD4BF",
        softAmber: "#FACC15",
        coralRed: "#F87171",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
