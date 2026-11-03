/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0eeff',
          100: '#e2deff',
          200: '#c6c0ff',
          300: '#aaa2ff',
          400: '#9a91ff',
          500: '#8c80ff',
          600: '#8274ff',
          700: '#6a5de6',
          800: '#5246b8',
          900: '#3a3383',
        },
        gold: {
          200: '#f1f5f7',
          300: '#e3eaf0',
          400: '#c8d7e3',
          500: '#a3b6c6',
        },
        cyan: {
          300: '#a6f2ff',
          400: '#68e8ff',
          500: '#36e0d0',
        },
        ultra: {
          400: '#9d92ff',
          500: '#8274ff',
          600: '#6a5de6',
        },
        ink: {
          950: '#080d18',
          900: '#101d2d',
          850: '#142338',
          800: '#1a2c44',
          700: '#243850',
          600: '#37506b',
        },
        soft: '#f1f5f7',
        muted: '#8795a8',
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
        scan: {
          '0%': { top: '-2%', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { top: '102%', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(130, 116, 255, 0.55)' },
          '50%': { boxShadow: '0 0 0 12px rgba(130, 116, 255, 0)' },
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
        scan: 'scan 2s cubic-bezier(0.45, 0, 0.55, 1) both',
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
