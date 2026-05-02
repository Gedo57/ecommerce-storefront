/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 50px rgba(67, 50, 39, 0.10)',
        card: '0 12px 32px rgba(67, 50, 39, 0.08)',
      },
      colors: {
        brand: {
          50: '#fbf8f3',
          100: '#f5efe7',
          200: '#eadfce',
          300: '#dbc5aa',
          400: '#b9946f',
          500: '#8b6a4b',
          600: '#6f5138',
          700: '#593f2c',
          800: '#433227',
          900: '#261d18',
        },
      },
    },
  },
  plugins: [],
};
