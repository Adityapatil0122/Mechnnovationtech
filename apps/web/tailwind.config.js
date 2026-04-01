/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        steel: {
          950: "#090d14",
          900: "#0d1320",
          850: "#11182a",
          800: "#161f33",
          700: "#1f2c47"
        },
        electric: {
          300: "#f08585",
          400: "#dc2a24",
          500: "#c70e08",
          600: "#a50b06"
        },
        paper: {
          50: "#fcfaf6",
          100: "#f3eee5",
          200: "#e4dbc9",
          300: "#d3c6b2"
        },
        forge: {
          900: "#1f272b",
          800: "#2f3a40",
          700: "#536068",
          600: "#6d7b83",
          500: "#85939a",
          400: "#9aa6ad"
        }
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["Outfit", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(199,14,8,0.12), 0 18px 42px rgba(199,14,8,0.18)"
      },
      backgroundImage: {
        metal: "linear-gradient(135deg, rgba(250,246,239,0.96), rgba(235,226,213,0.92))"
      }
    }
  },
  plugins: []
};






