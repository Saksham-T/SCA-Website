/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./careers.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#050816',
          panel: '#0a0d1d',
          card: '#0f132a',
          border: 'rgba(46, 84, 234, 0.2)',
          signal: '#39ff14',
          blue: '#2e54ea',
          violet: '#a855f7',
          amber: '#ffb703'
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
