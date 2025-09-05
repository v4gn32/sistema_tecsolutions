/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tecsolutions': {
          'primary': '#0D1F42',
          'accent': '#00E6E6',
        }
      }
    },
  },
  plugins: [],
};
