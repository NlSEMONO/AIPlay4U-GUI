/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'if': '#F7B400',
      },
      spacing: {
        '96': '24rem',
        '192': '48rem',
        '288': '72rem'
      }
    },
  },
  plugins: [],
}
