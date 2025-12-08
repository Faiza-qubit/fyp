/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // add this
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        golden: "hsl(45, 100%, 50%)"
      },
      borderColor: {
        border: "var(--border)",
      },
    }
  },
  plugins: [],
}
