/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFDB73',
          400: '#F5C842',
          500: '#F0B429',
          600: '#D99E1E',
          700: '#B38316',
          800: '#8C6810',
          900: '#664D0A',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
