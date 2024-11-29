/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px'
      },
      colors: {
        "ui-stroke": "#464646",
        "ui-blue": "#7D4EE9",
        "ui-input-stroke": "#DBDBDB",
        "ui-input-fill": "#E4E4E4",
        "ui-input-placeholder": "#3B3B3B"
      },
      aspectRatio: {
        '2/3': '2 / 3',
      }
    },
  },
  plugins: [],
}

