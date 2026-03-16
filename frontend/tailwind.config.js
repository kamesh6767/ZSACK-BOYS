/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#e8f4ff',
          100: '#d1e9ff',
          200: '#a3d3ff',
          300: '#75bdff',
          400: '#47a7ff',
          500: '#1991ff',
          600: '#0070e0',
          700: '#0055a8',
          800: '#003a70',
          900: '#001f38',
        },
        neon: {
          blue: '#00d4ff',
          green: '#00ff88',
          red: '#ff0055',
          purple: '#8b5cf6',
          orange: '#ff6b35',
        },
        dark: {
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#0d2137',
          400: '#0a1628',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'slideInLeft': 'slideInLeft 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 80px #00d4ff' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #001f38 0%, #0f3460 50%, #1a1a2e 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
        'danger-gradient': 'linear-gradient(135deg, #ff0055 0%, #ff6b35 100%)',
        'success-gradient': 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
