/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",

],
  theme: {
    extend: {
      fontFamily: {
        'digits': 'Quantico',
        'newText': 'Michroma'
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
};