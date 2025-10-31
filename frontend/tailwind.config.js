/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This tells Tailwind to scan your files
  ],
  theme: {
    extend: {},
  },
  plugins: [
     require('@tailwindcss/forms'), // A nice plugin for forms
  ],
}