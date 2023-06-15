const showYear = () => {
    const year = document.getElementById('footer-year')
    year.textContent = new Date().getFullYear()
}

export default showYear