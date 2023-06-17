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

    todos.getList(userId)

    // Projects dropdown
    const projects = new Projects()

    const options = await projects.getOptions(userId)

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

        const addTodoModalClicked = todos.addTodo.firstElementChild.contains(e.target) || todos.addTodoShowButton.contains(e.target)
        if (!addTodoModalClicked) {
            todos.closeAddTodo()
        }

        const addProjectClicked = projects.addProject.firstElementChild.contains(e.target) || projects.addProjectShowButton.contains(e.target)
        if (!addProjectClicked) {
            projects.closeAddProject()
        }
    });

    // const dones = new Dones()

    // if (todos.todosContainer.childElementCount <= 1) {
    //     todos.emptyState()
    // }
    // if (dones.donesContainer.childElementCount <= 1) {
    //     dones.emptyState()
    // }

    // Footer
    setInterval(setClock, 1000)
    showYear()
}

// const observer = new MutationObserver(() => {
//     if (todosContainer.childElementCount <= 1) {
//         emptyState('todos')
//     }
//     if (donesContainer.childElementCount <= 1) {
//         emptyState('dones')
//     }
// });

// observer.observe(todosContainer, { childList: true });
// observer.observe(donesContainer, { childList: true });