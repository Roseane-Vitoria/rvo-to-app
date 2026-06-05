/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f0f0f",
        accentViolet: "#7c3aed",
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
}
