/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          card: '#1a1a2e',
          lighter: '#252538',
        },
        neon: {
          orange: '#ff6b35',
          pink: '#ff2e63',
          yellow: '#ffd23f',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'typing': 'typing 0.05s steps(1)',
        'glow-border': 'glow-border 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.4), 0 0 40px rgba(255, 46, 99, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 46, 99, 0.4)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow-border': {
          '0%, 100%': {
            borderColor: 'rgba(255, 107, 53, 0.5)',
            boxShadow: '0 0 15px rgba(255, 107, 53, 0.3)'
          },
          '50%': {
            borderColor: 'rgba(255, 46, 99, 0.5)',
            boxShadow: '0 0 25px rgba(255, 46, 99, 0.4)'
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-sunset': 'linear-gradient(135deg, #ff6b35 0%, #ff2e63 50%, #ffd23f 100%)',
      },
    },
  },
  plugins: [],
}
