/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./todo/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      },
      backgroundImage: {
        'login': "url('./src/img/bg-login.png')",
        'register': "url('./src/img/bg-register.png')",
        'navbar': "url('./src/img/bg-navbar.png')"
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