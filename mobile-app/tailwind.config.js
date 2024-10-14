import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5573ED',
        primary_darker: '#3b4fba',
        primary_opaque: '#8396E5',
        secondary: '#8cbce6', //00A3FF
        danger: '#ff4961',
        medium: '#9d9ea3',
        grey: '#64656A',
        dark: '#171717',
        whiteSmoke: '#F0F3FB',
        whiteSmoke_darker: '#c1c5d8',
        light: '#f7f8fa',
        'light-blue': '#e6ecfc',
        border: '#dee2e6',
        label: '#7E849E',
        'blue-1000': '#2A30F4',
      },
      fontFamily: {
        anybody: ['Anybody', 'sans-serif'],
      },
      boxShadow: {
        'md-unblur': '0 4px 10px 0px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    plugin(function ({ matchVariant }) {
      matchVariant('part', (value) => {
        return `&::part(${value})`;
      });
    }),
  ],
};
