/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gift: {
          gold: '#FFD700',
          rose: '#FF4D6D',
          ruby: '#E63946',
          violet: '#7209B7',
          deep: '#0B091A',
          card: 'rgba(255, 255, 255, 0.07)',
          border: 'rgba(255, 255, 255, 0.15)',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'shake-infinite': 'shakeSoft 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0) rotate(-2deg)' },
          '20%, 80%': { transform: 'translate3d(3px, 0, 0) rotate(3deg)' },
          '30%, 50%, 70%': { transform: 'translate3d(-5px, 0, 0) rotate(-4deg)' },
          '40%, 60%': { transform: 'translate3d(5px, 0, 0) rotate(4deg)' },
        },
        shakeSoft: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-4deg) translateY(-2px)' },
          '75%': { transform: 'rotate(4deg) translateY(-2px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
