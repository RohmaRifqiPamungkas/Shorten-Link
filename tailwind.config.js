import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],

  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Poppins',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		colors: {
  			primary: {
  				'25': 'rgba(1, 81, 150, 0.25)',
  				'50': 'rgba(1, 81, 150, 0.5)',
  				'75': '#015196bf',
  				'100': '#015196',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
			secondary: {
			'25': '#FFF7E5',
			'50': '#FFE9B5',
			'75': '#FFD166',
			'100': '#FF9F1C',
			DEFAULT: '#FF9F1C',
			foreground: '#ffffff'
			},
  			tertiary: '#F0F8FF',
  			foreground: 'hsl(var(--foreground))',
  			background: 'hsl(var(--background))',
  			brfourth: '#DDDDDD',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			primary: '0px 4px 160px 0px #01519680',
  			fourth: '0px 4px 70px 0px #01519680'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			fadeIn: {
				'0%': { opacity: '0', transform: 'translateX(20px)' },
				'100%': { opacity: '1', transform: 'translateX(0)' },
			},
			fadeOut: {
				'0%': { opacity: '1', transform: 'translateX(0)' },
				'100%': { opacity: '0', transform: 'translateX(20px)' },
			},
		},
		animation: {
		fadeIn: 'fadeIn 0.3s ease-out forwards',
		fadeOut: 'fadeOut 0.3s ease-in forwards',
		},
  	}
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

  plugins: [forms, require("tailwindcss-animate")],
};
