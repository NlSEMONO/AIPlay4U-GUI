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
        'def': '#C0C0C0',
        'set': '#D9D9D9',
        'rt': '#2D882D',
        'rc': '#116611',
        'cond': '#2D4671'
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
