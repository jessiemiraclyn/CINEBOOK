/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f3',
          100: '#ffe0e4',
          200: '#ffc2ca',
          300: '#ff8a9a',
          400: '#ff4d64',
          500: '#f5173a',
          600: '#e50926',
          700: '#b80720',
          800: '#8c0619',
          900: '#450a16',
        },
        gold: {
          200: '#ecd9a6',
          300: '#e2c985',
          400: '#d6b46a',
          500: '#b8924c',
        },
        ink: {
          950: '#080808',
          900: '#111111',
          850: '#161616',
          800: '#1d1d1d',
          700: '#2a2a2a',
          600: '#3d3d3d',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#facc15',
          500: '#eab308',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(229, 9, 38, 0.45)' },
          '50%': { boxShadow: '0 0 0 10px rgba(229, 9, 38, 0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-2%, 1.5%, 0) scale(1.06)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'scale-in': 'scaleIn 0.25s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
        drift: 'drift 22s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
