import '../../css/style.css'

// import getProjects, { selectProject } from '../projects';
// import getTodos from '../todos'
import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'
import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/' || window.location.pathname == '/home') {
    // Projects dropdown
    const projects = new Projects()
    projects.projectsDropdown.addEventListener('click', () => {
        projects.showProjectOptions()
    })
    // Sliding menu
    const menu = new Menu()
    menu.showMenuButton.addEventListener('click', () => {
        menu.showMenu()
    })
    // Add task modal
    const todos = new Todos()
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

    document.addEventListener('click', (e) => {
        if (!menu.menu.contains(e.target) && e.target !== menu.showMenuButton) {
            menu.closeMenu()
            // isAddOptionsVisible = false
        } else if (!projects.projectsOptions.contains(e.target) && e.target !== projects.projectsDropdown) {
            projects.closeProjectOptions()
        }
        // else if (isModalVisible && !addModal.contains(event.target) && event.target !== showButton) {
        //     console.log('Woah')
        // addTaskModal.close()
        // isModalVisible = false
    });

    const dones = new Dones()

    if (todos.todosContainer.childElementCount <= 1) {
        todos.emptyState()
    }
    if (dones.donesContainer.childElementCount <= 1) {
        dones.emptyState()
    }

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