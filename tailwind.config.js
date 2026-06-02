/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        papaya: "#FF8700",
        ink: "#050505",
        charcoal: "#151515",
        graphite: "#242424"
      }
    }
  },
  plugins: []
};
