import '../../css/style.css'

import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'
import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/' || window.location.pathname == '/home') {
    const userId = document.getElementById('current-user').dataset.user

    // List of todos
    const todos = new Todos()

    const todosList = await todos.getList(userId)

    if (todosList.length === 0) {
        const empty = todos.emptyState()
        const getStartedButton = empty.lastElementChild
        getStartedButton.addEventListener('click', () => {
            todos.showAddTodo()
        })
    }

    // List of dones
    const dones = new Dones()

    const donesList = await dones.getList(userId)

    if (donesList.length === 0) {
        dones.emptyState()
    }

    // Projects dropdown
    const projects = new Projects()

    const options = await projects.getOptions(userId)

    if (options) {
        projects.dropdown.addEventListener('click', () => {
            projects.showOptions()
        })

        // Filter todos by projects
        options.forEach((option) => {
            option.addEventListener('click', async () => {
                projects.selected.textContent = option.textContent
                projects.closeOptions()

                const todosData = await todos.getData(userId)
                todos.filterByProjects(todosData, option.dataset.value)
            })
        })
    } else {
        console.log('Empty State for projects.')
    }


    // Sliding menu
    const menu = new Menu()
    menu.showMenuButton.addEventListener('click', () => {
        menu.showMenu()
    })

    // Add task modal
    todos.addTodoShowButton.addEventListener('click', () => {
        todos.showAddTodo()
    })
    todos.addTodoCloseButton.addEventListener('click', () => {
        todos.closeAddTodo()
    })

    // Add project modal
    projects.addProjectShowButton.addEventListener('click', () => {
        projects.showAddProject()
    })
    projects.addProjectCloseButton.addEventListener('click', () => {
        projects.closeAddProject()
    })

    // Closing modal if clicked outside
    document.addEventListener('click', (e) => {
        const menuClicked = menu.menu.contains(e.target) || menu.showMenuButton.contains(e.target)
        if (!menuClicked) {
            menu.closeMenu()
        }

        const projectDropdownClicked = projects.dropdown.contains(e.target)
        if (!projectDropdownClicked) {
            projects.closeOptions();
        }

        const getStartedButton = document.getElementById('home-todos-get-started')
        const addTodoModalClicked = todos.addTodo.firstElementChild.contains(e.target) || todos.addTodoShowButton.contains(e.target) || getStartedButton.contains(e.target)
        if (!addTodoModalClicked) {
            todos.closeAddTodo()
        }

        const addProjectClicked = projects.addProject.firstElementChild.contains(e.target) || projects.addProjectShowButton.contains(e.target)
        if (!addProjectClicked) {
            projects.closeAddProject()
        }
    });

    // Footer
    const footer = document.getElementById('footer')
    if (footer.hasChildNodes) {
        footer.classList.add('mt-8')
    }

    setInterval(setClock, 1000)
    showYear()
}