/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        fraud: { DEFAULT: '#E24B4A', light: '#FCEBEB', dark: '#A32D2D' },
        safe:  { DEFAULT: '#639922', light: '#EAF3DE', dark: '#3B6D11' },
        shield:'#1a1a2e',
      },
    },
  },
  plugins: [],
}
