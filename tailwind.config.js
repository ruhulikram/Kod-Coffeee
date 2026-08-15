/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral UI System (Modern Zinc / Slate)
        espresso: {
          950: '#09090B',
          900: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8',
          200: '#E4E4E7',
          100: '#F4F4F5',
          50: '#FAFAFA',
        },
        // Neutral Light Surfaces (Crisp Cool Slate)
        oat: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
        },
        // Single Base Coffeeshop Accent Color (Rich High-Contrast Amber / Gold Crema)
        crema: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        // Semantic Status Colors
        brew: {
          DEFAULT: '#16A34A',
          light: '#F0FDF4',
          dark: '#14532D',
        },
        ember: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
          dark: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(30, 27, 24, 0.05), 0 4px 16px -4px rgba(30, 27, 24, 0.08)',
        'elevated': '0 8px 30px -6px rgba(30, 27, 24, 0.12), 0 4px 12px -2px rgba(30, 27, 24, 0.04)',
        'floating': '0 20px 40px -10px rgba(30, 27, 24, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
