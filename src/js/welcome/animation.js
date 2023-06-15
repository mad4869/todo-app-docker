import Lottie from 'lottie-web';

const loadAnimations = () => {
    const bgContainer = document.getElementById('welcome-bg-container')
    const loadingContainer = document.getElementById('welcome-loading-container')
    const bgData = require('../../animations/background.json')
    const loadingData = require('../../animations/loading.json')

    Lottie.loadAnimation({
        container: bgContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: bgData
    })
    Lottie.loadAnimation({
        container: loadingContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: loadingData
    })
}

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

export default loadAnimations

