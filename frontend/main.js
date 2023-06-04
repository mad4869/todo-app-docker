import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './style.css'

import Lottie from 'lottie-web';

const lottieContainer = document.getElementById('lottie-container')
const animationData = require('./background.json')
Lottie.loadAnimation({
    container: lottieContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData
})

const clock = () => {
    const date = new Date()
    document.getElementById('clock').innerHTML = date.toLocaleTimeString([], { hour12: false })
}

setInterval(clock, 1000)

// document.addEventListener('DOMContentLoaded', function () {
//     function updateProgressBar() {
//         const progressBar = document.querySelector('.progress')
//         const progress = Math.floor((performance.now() / 3000) * 100)
//         progressBar.style.width = progress + '%'
//     }
//     function hideWelcomeScreen() {
//         const welcome = document.getElementById('welcome')
//         welcome.style.display = 'none'
//         const homepage = document.getElementById('homepage')
//         homepage.style.display = 'block'
//     }
//     window.onload = function () {
//         updateProgressBar()
//         setTimeout(hideWelcomeScreen, 3000)
//     }
// })