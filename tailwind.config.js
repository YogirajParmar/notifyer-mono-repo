/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/frontend/renderer/index.html',
    './src/frontend/renderer/**/*.{js,ts,jsx,tsx}',
    './src/frontend/renderer/components/**/*.{js,ts,jsx,tsx}',
    './src/frontend/renderer/components/home/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
