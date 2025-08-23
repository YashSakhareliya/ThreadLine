/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Customer palette
        customer: {
          primary: '#4F46E5', // Indigo
          secondary: '#06B6D4', // Cyan
          light: '#EEF2FF',
          dark: '#312E81'
        },
        // Tailor palette
        tailor: {
          primary: '#EC4899', // Rose
          secondary: '#8B5CF6', // Purple
          light: '#FDF2F8',
          dark: '#831843'
        },
        // Shop palette
        shop: {
          primary: '#10B981', // Emerald
          secondary: '#F59E0B', // Amber
          light: '#ECFDF5',
          dark: '#064E3B'
        },
        // Global accents
        accent: {
          teal: '#14B8A6',
          gold: '#D97706',
          slate: '#64748B'
        },
        border: {
      DEFAULT: '#E5E7EB', // Tailwind's slate-200
    },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(79, 70, 229, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}