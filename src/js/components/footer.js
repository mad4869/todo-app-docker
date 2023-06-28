const setClock = () => {
    const date = new Date()
    const clock = document.getElementById('footer-clock')

    clock.textContent = date.toLocaleTimeString([], { hour12: false })
}

const showYear = () => {
    const year = document.getElementById('footer-year')
    year.textContent = new Date().getFullYear()
}

const handleFooter = () => {
    const footer = document.getElementById('footer')
    if (footer.hasChildNodes) {
        footer.classList.add('mt-8')
    }

    setInterval(setClock, 1000)
    showYear()
}

export default handleFooter