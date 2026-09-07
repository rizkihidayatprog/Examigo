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
        edu: {
          navy: 'var(--theme-primary-dark, #064E3B)',
          navyDark: 'var(--theme-primary-hover, #022C22)',
          navyLight: 'var(--theme-primary, #065F46)',
          electric: 'var(--theme-mint, #10B981)',
          electricHover: 'var(--theme-mint-hover, #059669)',
          electricLight: 'var(--theme-mint-light, #ECFDF5)',
          sage: 'var(--theme-mint, #059669)',
          sageLight: 'var(--theme-bg, #F0FDF4)',
          butter: 'var(--theme-mint, #10B981)',
          butterLight: 'var(--theme-mint-light, #ECFDF5)',
          white: 'var(--theme-surface, #FFFFFF)',
        },
        brand: {
          50: 'var(--theme-bg, #F0FDF4)',
          100: 'var(--theme-mint-light, #DCFCE7)',
          200: 'var(--theme-mint-subtle, #BBF7D0)',
          300: 'var(--theme-border-strong, #86EFAC)',
          400: 'var(--theme-mint, #4ADE80)',
          500: 'var(--theme-mint, #10B981)',
          600: 'var(--theme-mint-hover, #059669)',
          700: 'var(--theme-primary-hover, #047857)',
          800: 'var(--theme-text-body, #065F46)',
          900: 'var(--theme-primary-dark, #064E3B)',
          950: 'var(--theme-primary-dark, #022C22)',
        },
        emerald: {
          50: 'var(--theme-bg, #ECFDF5)',
          100: 'var(--theme-mint-light, #D1FAE5)',
          200: 'var(--theme-mint-subtle, #A7F3D0)',
          300: 'var(--theme-border, #6EE7B7)',
          400: 'var(--theme-mint, #34D399)',
          500: 'var(--theme-mint, #10B981)',
          600: 'var(--theme-mint-hover, #059669)',
          700: 'var(--theme-primary-hover, #047857)',
          800: 'var(--theme-primary-dark, #065F46)',
          900: 'var(--theme-primary-dark, #064E3B)',
          950: 'var(--theme-primary-dark, #022C22)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'edu-sm': '0 2px 8px -2px rgba(6, 78, 59, 0.06), 0 1px 4px -1px rgba(6, 78, 59, 0.04)',
        'edu-card': '0 8px 24px -4px rgba(6, 78, 59, 0.06), 0 2px 6px -1px rgba(6, 78, 59, 0.03)',
        'edu-hover': '0 14px 32px -4px rgba(6, 78, 59, 0.12), 0 4px 12px -2px rgba(6, 78, 59, 0.06)',
        'edu-button': '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
        'edu-butter': '0 4px 14px 0 rgba(16, 185, 129, 0.35)',
        'edu-sage': '0 4px 14px 0 rgba(5, 150, 105, 0.3)',
      }
    },
  },
  plugins: [],
}
