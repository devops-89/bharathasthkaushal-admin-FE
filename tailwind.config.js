

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2e9',
          100: '#fae5d3',
          200: '#f4c2a1',
          300: '#ed9f6f',
          400: '#e6754a',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        craft: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        earth: {
          50: '#f6f3f0',
          100: '#e7e2df',
          200: '#d3c7c0',
          300: '#b8a397',
          400: '#a08674',
          500: '#8b6f47',
          600: '#6d5635',
          700: '#5a462b',
          800: '#4a3a25',
          900: '#3f3421',
        }
      },
    },
  },
  plugins: [],
}
