/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'angular-sm': '600px',
      'angular-md': '960px',
      'angular-lg': '1280px',
      'angular-xl': '1920px',
    },
    extend: {},
  },
  plugins: [],
}

