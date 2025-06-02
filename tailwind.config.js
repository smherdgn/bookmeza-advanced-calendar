/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-md': '0 4px 6px rgba(0,0,0,0.1)',
        'soft-lg': '0 10px 15px rgba(0,0,0,0.1)',
        // From constants.ts theme
        'shadow-small': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px 0 rgba(0,0,0,0.05)',
        'shadow-medium': '0 4px 6px rgba(0,0,0,0.1)',
        'shadow-large': '0 10px 15px rgba(0,0,0,0.1)',
      },
      colors: {
        // These are Tailwind color names, effectively.
        // We are using Tailwind's utility classes like 'bg-indigo-500',
        // not custom CSS vars like var(--primary-color).
        // This section is for *extending* Tailwind's palette if needed.
        // The theme object in constants.ts uses Tailwind class names directly.
      },
      borderRadius: {
        // from constants.ts theme (Tailwind class names)
        'rounded-small': '0.375rem', // md
        'rounded-medium': '0.5rem',  // lg
        'rounded-large': '0.75rem', // xl
      },
      animation: {
        modalShow: 'modalShowAnimation 0.2s ease-out forwards',
      },
      keyframes: {
        modalShowAnimation: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};