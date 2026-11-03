/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#dde5ff',
          200: '#bfcdff',
          300: '#8fa6ff',
          400: '#6b88ff',
          500: '#4a6bff',
          600: '#3155ff',
          700: '#2644d6',
          800: '#1c33a6',
          900: '#12226b',
        },
        gold: {
          200: '#ebffb8',
          300: '#e0ff88',
          400: '#d5ff50',
          500: '#b4db38',
        },
        cyan: {
          300: '#9af3ff',
          400: '#4debff',
          500: '#26d3ee',
        },
        ultra: {
          400: '#a56bff',
          500: '#873cff',
          600: '#6e22e6',
        },
        ink: {
          950: '#090a12',
          900: '#0f1020',
          850: '#14162a',
          800: '#1b1d35',
          700: '#272a45',
          600: '#3a3e5c',
        },
        soft: '#f3f2ee',
        muted: '#9293a4',
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
        display: ['Anton', 'Impact', 'sans-serif'],
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(49, 85, 255, 0.55)' },
          '50%': { boxShadow: '0 0 0 12px rgba(49, 85, 255, 0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-2%, 1.5%, 0) scale(1.06)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(-2deg)' },
          '50%': { transform: 'translate3d(0, -14px, 0) rotate(2deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'scale-in': 'scaleIn 0.25s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
        drift: 'drift 22s ease-in-out infinite',
        float: 'float 9s ease-in-out infinite',
        'spin-slow': 'spinSlow 38s linear infinite',
        sweep: 'sweep 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
