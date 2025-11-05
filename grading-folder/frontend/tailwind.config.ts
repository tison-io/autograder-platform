import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d2c7',
          300: '#a3b5a3',
          400: '#7d937d',
          500: '#5f755f',
          600: '#4a5c4a',
          700: '#3e4b3e',
          800: '#333d33',
          900: '#2b332b',
        },
        beige: {
          50: '#fdfcfa',
          100: '#f7f4f0',
          200: '#f0e8df',
          300: '#e4d5c7',
          400: '#d6bfa6',
          500: '#c8a882',
          600: '#b8956a',
          700: '#9a7c56',
          800: '#7e664a',
          900: '#66533d',
        },
      },
    },
  },
  plugins: [],
};

export default config;