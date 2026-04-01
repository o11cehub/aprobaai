/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0D0F14',
        panel: '#151922',
        border: '#1E2530',
        blue: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        green: {
          DEFAULT: '#22C55E',
          dim: '#16A34A',
        },
        orange: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          dim: '#92400E',
        },
        red: {
          DEFAULT: '#EF4444',
          dim: '#991B1B',
        },
        text: {
          DEFAULT: '#E5E7EB',
          muted: '#9CA3AF',
          dim: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 0 0 1px #1E2530',
        glow: '0 0 20px rgba(245, 158, 11, 0.15)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [],
}
