/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050A18',
          900: '#0A1128',
          800: '#0F172A',
          700: '#162036',
          600: '#1E293B',
        },
        slate: {
          750: '#293548',
        },
        accent: {
          cyan: '#22D3EE',
          indigo: '#818CF8',
          violet: '#A78BFA',
          emerald: '#34D399',
          amber: '#FBBF24',
          rose: '#FB7185',
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        'hero-glow': 'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-indigo': '0 0 20px rgba(129, 140, 248, 0.3)',
        'glow-rose': '0 0 20px rgba(251, 113, 133, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
