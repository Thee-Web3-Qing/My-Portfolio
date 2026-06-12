/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EF',
        ink: '#16161D',
        electric: '#6E5BFF',
        coral: '#FF6A4D',
        lime: '#D6FF3F',
        mid: '#8A8A99',
        line: '#E4DECF',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        blob: '2rem 0.5rem 2rem 0.5rem',
      },
    },
  },
  plugins: [],
}