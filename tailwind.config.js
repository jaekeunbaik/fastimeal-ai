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
        fasting: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          glow: '#60a5fa'
        },
        eating: {
          green: '#10b981',
          emerald: '#059669',
          lime: '#84cc16',
          glow: '#34d399'
        },
        metabolism: {
          digest: '#f59e0b',
          insulin: '#3b82f6',
          glycogen: '#8b5cf6',
          ketosis: '#ec4899',
          autophagy: '#10b981'
        },
        dark: {
          bg: '#0a0f1d',
          card: '#131c31',
          surface: '#1e293b',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
