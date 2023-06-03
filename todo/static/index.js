const clock = () => {
    const date = new Date()
    document.getElementById('clock').innerHTML = date.toLocaleTimeString([], { hour12: false })
}

setInterval(clock, 1000)

document.addEventListener('DOMContentLoaded', function () {
    function updateProgressBar() {
        const progressBar = document.querySelector('.progress')
        const progress = Math.floor((performance.now() / 3000) * 100)
        progressBar.style.width = progress + '%'
    }
    function hideWelcomeScreen() {
        const welcome = document.getElementById('welcome')
        welcome.style.display = 'none'
        const homepage = document.getElementById('homepage')
        homepage.style.display = 'block'
    }
    window.onload = function () {
        updateProgressBar()
        setTimeout(hideWelcomeScreen, 3000)
    }
})