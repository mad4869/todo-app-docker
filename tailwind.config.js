/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./todo/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      },
      backgroundImage: {
        'login': "url('../todo/static/assets/bg-login.png')",
        'register': "url('../todo/static/assets/bg-register.png')",
        'navbar': "url('../todo/static/assets/bg-navbar.png')"
      },
      dropShadow: {
        'right': '5px 0px 10px rgba(0, 0, 0, 0.3)'
      },
      borderRadius: {
        '4xl': '3rem'
      }
    },
  },
  plugins: [],
}