import '../../css/style.css'

import { handleFlash } from '../components/notice'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Mobile screen
const hamburger = document.getElementById('landing-hamburger-button')
const menu = document.getElementById('landing-hamburger-menu')

hamburger.addEventListener('click', () => {
    menu.classList.toggle('opacity-0')
    menu.classList.toggle('opacity-100')
})