/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    'node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}', // Add this line for PrimeVue components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-primeui'), // Add the tailwindcss-primeui plugin
  ],
};


