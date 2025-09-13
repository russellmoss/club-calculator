/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4A5568',
          background: "#D8D1AE",
          darkBrown: "#5A3E00",
          darkBrownHover: "#3D2900",
        },
        fontFamily: {
          gilda: ["Gilda Display", "serif"],
        },
        keyframes: {
          'fade-in': {
            '0%': {
              opacity: '0',
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)'
            }
          }
        },
        animation: {
          'fade-in': 'fade-in 0.3s ease-out forwards'
        }
      },
    },
    plugins: [],
  };
  