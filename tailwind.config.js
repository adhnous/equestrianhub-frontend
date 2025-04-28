/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      textDirection: {
        'rtl': 'rtl',
        'ltr': 'ltr',
      },
    },
  },
  plugins: [],
}
