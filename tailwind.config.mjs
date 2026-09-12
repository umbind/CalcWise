/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0B4F8A',
          'primary-dark': '#083B68',
          'primary-light': '#EAF2F9',
          accent: '#0F766E',
          'accent-light': '#F0FDFA',
          warning: '#8A4B08',
          error: '#B42318',
          success: '#087A55',
          dark: '#111827',
          muted: '#4B5563',
          surface: '#F3F6FA',
          border: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
