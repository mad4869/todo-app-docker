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

    projects.addProjectShowButton.addEventListener('click', () => {
        projects.showAddProject()
    })

    projects.addProjectCloseButton.addEventListener('click', () => {
        projects.closeAddProject()
    })

    projects.editProjectCloseButtons.addEventListener('click', () => {
        projects.closeEditProject()
    })

    projects.deleteProjectCloseButtons.addEventListener('click', () => {
        projects.closeDeleteProject()
    })

    projects.addTodoCloseButton.addEventListener('click', () => {
        projects.closeAddTodo()
    })

    // Footer
    const footer = document.getElementById('footer')
    if (footer.hasChildNodes) {
        footer.classList.add('mt-8')
    }

    setInterval(setClock, 1000)
    showYear()
}