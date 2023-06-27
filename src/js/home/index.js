import '../../css/style.css'

import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'

import createButton from '../components/button'
import createSeparator from '../components/separator'

import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/home') {
    // Logged in user
    const userId = document.getElementById('current-user').dataset.user

    // Objects instances
    const projects = new Projects(userId)
    const todos = new Todos(userId)
    const dones = new Dones(userId)
    const menu = new Menu()

    // Projects section
    projects.attachEventListeners()

    const options = await projects.getOptions(userId)
    if (options) {
        options.forEach((option) => {
            option.addEventListener('click', async () => {
                projects.filter.selected.textContent = option.textContent
                projects.closeOptions()

                todos.filterByProjects(option.dataset.value)
                dones.filterByProjects(option.dataset.value)
            })
        })
    } else {
        projects.emptyState()
    }

    // Todos section
    todos.attachEventListeners()

    const todosStack = await todos.getStack()
    if (todosStack.length === 0) {
        todos.emptyState()
    }

    // Dones section
    dones.attachEventListeners()

    const donesStack = await dones.getStack()
    if (donesStack.length === 0) {
        dones.emptyState()
    }

    // Menu section
    menu.attachEventListeners()

    // Drag and Drop
    const handleSwitch = (dropped, oldColor, newColor, newButton) => {
        const heading = dropped.firstElementChild
        heading.classList.remove(oldColor)
        heading.classList.add(newColor)

        const rightButtons = dropped.lastElementChild.lastElementChild
        const oldButton = rightButtons.firstElementChild
        oldButton.remove()

        rightButtons.append(newButton)
    }

    let originalContainer = null

    const allTasks = document.querySelectorAll('div[draggable="true"]')
    allTasks.forEach((task) => {
        task.addEventListener('dragstart', (e) => {
            originalContainer = e.target.parentNode
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'))

            setTimeout(() => {
                e.target.classList.add('hidden');
                e.target.previousElementSibling.classList.add('hidden')
            }, 0);
        })
        task.addEventListener('dragend', (e) => {
            e.target.classList.remove('hidden')
            e.target.previousElementSibling.classList.remove('hidden')
        })
    })

    todos.stack.container.addEventListener('drop', (e) => {
        e.preventDefault()
        todos.stack.container.classList.remove('bg-fuchsia-400')

        const data = e.dataTransfer.getData('text/plain')

        if (originalContainer == todos.stack.container) {
            return
        }

        const dropped = document.querySelector(`[data-id="${data}"]`)
        const doneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-violet-700', '<i class="fa-solid fa-check"></i>', () => { todos.markAsDone(data) }, 'done-button', 'Mark as done')

        handleSwitch(dropped, 'bg-teal-600', 'bg-violet-700', doneButton)

        const separator = createSeparator('bg-violet-200')

        todos.stack.container.append(separator, dropped)

        dones.dragAsUndone(data)
    })

    dones.stack.container.addEventListener('drop', (e) => {
        e.preventDefault()
        dones.stack.container.classList.remove('bg-teal-300')

        const data = e.dataTransfer.getData('text/plain')

        if (originalContainer == dones.stack.container) {
            return
        }

        const dropped = document.querySelector(`[data-id="${data}"]`)
        const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', () => { dones.markAsUndone(data) }, 'undone-button', 'Mark as undone')

        handleSwitch(dropped, 'bg-violet-700', 'bg-teal-600', undoneButton)

        const separator = createSeparator('bg-teal-200')

        dones.stack.container.append(separator, dropped)

        todos.dragAsDone(data)
    })

    // Closing modal if clicked outside
    document.addEventListener('click', (e) => {
        const menuClicked = menu.menu.contains(e.target) || menu.show.contains(e.target)
        if (!menuClicked) {
            menu.closeMenu()
        }

        const projectDropdownClicked = projects.filter.dropdown.contains(e.target) || projects.filter.options.contains(e.target)
        if (!projectDropdownClicked) {
            projects.closeOptions();
        }

        const todosCtaButton = document.querySelector('button[name="todo-cta-button"]')
        let addTodoClicked = todos.add.modal.firstElementChild.contains(e.target) || todos.add.show.contains(e.target)
        if (todosCtaButton) {
            addTodoClicked = todos.add.modal.firstElementChild.contains(e.target) || todos.add.show.contains(e.target) || todosCtaButton.contains(e.target)
        }
        if (!addTodoClicked) {
            todos.closeAddModal()
        }

        const projectsCtaButton = document.querySelector('button[name="project-cta-button"]')
        let addProjectClicked = projects.add.modal.firstElementChild.contains(e.target) || projects.add.show.contains(e.target)
        if (projectsCtaButton) {
            addProjectClicked = projects.add.modal.firstElementChild.contains(e.target) || projects.add.show.contains(e.target) || projectsCtaButton.contains(e.target)
        }
        if (!addProjectClicked) {
            projects.closeAddModal()
        }

        const editTodoButtons = document.querySelectorAll('button[name="edit-button"]')
        const editTodoClicked = todos.edit.modal.firstElementChild.contains(e.target) || Array.from(editTodoButtons).some((edit) => edit.contains(e.target))
        if (!editTodoClicked) {
            todos.closeEditModal()
        }

        const deleteTodoButtons = document.querySelectorAll('button[name="delete-button"]')
        const deleteTodoClicked = todos.delete.modal.firstElementChild.contains(e.target) || Array.from(deleteTodoButtons).some((del) => del.contains(e.target))
        if (!deleteTodoClicked) {
            todos.closeDeleteModal()
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