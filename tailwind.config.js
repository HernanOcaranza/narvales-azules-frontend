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
          main: '#0D7CAD',
          light: '#3AA8D0',
          dark: '#085A7D',
        },
        secondary: {
          main: '#8DCDE5',
          light: '#B8E4F5',
          dark: '#5BA8C9',
        },
        background: '#DCEFF7',
        text: {
          primary: '#0D3244',
          secondary: '#4A7A8C',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '12px',
      },
    },
  },
  plugins: [],
}