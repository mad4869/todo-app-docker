import '../../css/style.css'

import Projects from './projects'

import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/projects') {
    // Logged in user
    const userId = document.getElementById('current-user').dataset.user
    const link = document.querySelector('a[href="/projects"]')
    link.classList.add('text-teal-400')

    const projects = new Projects()

    projects.getList(userId)

    // Footer
    const footer = document.getElementById('footer')
    if (footer.hasChildNodes) {
        footer.classList.add('mt-8')
    }

    setInterval(setClock, 1000)
    showYear()
}