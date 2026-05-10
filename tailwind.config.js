/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#10B981",
        accent: "#F59E0B",
        background: { DEFAULT: "#F9FAFB", dark: "#0f172a" },
        surface: { DEFAULT: "#FFFFFF", dark: "#1e293b" },
        text: { DEFAULT: "#1F2937", dark: "#f1f5f9" },
        textMuted: { DEFAULT: "#6B7280", dark: "#94a3b8" }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
