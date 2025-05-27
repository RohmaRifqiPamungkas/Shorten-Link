import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          25: 'rgba(1, 81, 150, 0.25)',
          50: 'rgba(1, 81, 150, 0.5)',
          75: 'rgba(1, 81, 150, 0.75)',
          100: '#015196',
        },
        secondary: '#f19636',
        tertiary: '#F0F8FF',
        foreground: '#555555',
        background: '#ffffff',
        brfourth: '#DDDDDD',
      },
      boxShadow: {
        primary: '0px 4px 160px 0px #01519680',
        fourth: '0px 4px 70px 0px #01519680',
      },
    },
  },

  safelist: [

    'bg-gradient-to-br',
    'bg-gradient-to-tr',
  
    'from-primary-25',
    'from-primary-50',
    'from-primary-75',
    'from-primary-100',
    'to-transparent',
  ],

  plugins: [forms],
};
