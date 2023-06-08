import './style.css'

import Lottie from 'lottie-web';

const backgroundContainer = document.getElementById('background-container')
const loadingContainer = document.getElementById('loading-container')
const backgroundData = require('./background.json')
const loadingData = require('./loading.json')
Lottie.loadAnimation({
    container: backgroundContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: backgroundData
})
Lottie.loadAnimation({
    container: loadingContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: loadingData
})

const setClock = () => {
    const date = new Date()
    const clock = document.getElementById('clock')
    if (clock) {
        clock.innerHTML = date.toLocaleTimeString([], { hour12: false })
    }
}

setInterval(setClock, 1000)

const showYear = () => {
    const year = document.getElementById('year')
    if (year) {
        year.innerHTML = new Date().getFullYear()
    }
}

window.onload = showYear

const addTask = document.getElementById('add-task')

const showButton = document.getElementById('show-button')
showButton.addEventListener('click', function () {
    addTask.show()
})

const closeButton = document.getElementById('close-button')
closeButton.addEventListener('click', function () {
    addTask.close()
})

const closeAddTaskModal = () => {
    const addTask = document.getElementById('add-task')
    if (addTask.hasAttribute('open')) {
        addTask.removeAttribute('open')
    }
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