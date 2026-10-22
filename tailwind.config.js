/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './mdx-components.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: '#0a0e27',
        darker: '#050811',
        ink: '#0b0f1a',
        mist: '#c7ccd6',
        glow: '#a34f2b',
        neon: '#b8653f',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 10px rgba(110, 231, 255, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(110, 231, 255, 0.8)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(0) translateY(-20px)' },
          '75%': { transform: 'translateX(-10px) translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(110, 231, 255, 0.3)',
        'glow': '0 0 30px rgba(110, 231, 255, 0.4)',
        'glow-lg': '0 0 50px rgba(110, 231, 255, 0.5)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.4)',
        'neon-border': 'inset 0 0 20px rgba(110, 231, 255, 0.1)',
      },
    },
  },
  plugins: [],
};
