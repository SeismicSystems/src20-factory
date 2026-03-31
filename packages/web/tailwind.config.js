/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        seismic: {
          bg: "#0D0D0D",
          black: "#161616",
          cream: "#D1CCBF",
          mauve: "#825A6D",
          purple: "#523542",
          gold: "#A6924D",
        },
      },
      fontFamily: {
        suisse: ["SuisseIntl", "sans-serif"],
        "suisse-works": ["SuisseWorks", "serif"],
      },
      boxShadow: {
        "seismic-card":
          "0 0 20px rgba(209, 204, 191, 0.08), 0 0 40px rgba(209, 204, 191, 0.03)",
        "seismic-glow":
          "0 0 30px rgba(209, 204, 191, 0.2), 0 0 60px rgba(209, 204, 191, 0.08)",
      },
    },
  },
  plugins: [],
};
