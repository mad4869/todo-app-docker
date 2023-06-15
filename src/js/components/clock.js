const setClock = () => {
    const date = new Date()
    const clock = document.getElementById('footer-clock')

    clock.textContent = date.toLocaleTimeString([], { hour12: false })
}

export default setClock