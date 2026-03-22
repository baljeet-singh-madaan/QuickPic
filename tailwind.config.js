/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'qp-bg': '#121212',
        'qp-surface': '#1F1F1F',
        'qp-accent': '#00D4C8',
        'qp-sidebar': '#1C1B1B',
        'qp-text': '#E5E2E1',
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}