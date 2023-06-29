import '../../css/style.css'

import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'

import createButton from '../components/button'
import createSeparator from '../components/separator'
import { handleFlash } from '../components/notice'
import handleLogout from '../components/logout'
import handleFooter from '../components/footer'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// Object instances with the logged in user data
const projects = new Projects(userId)
const todos = new Todos(userId)
const dones = new Dones(userId)
const menu = new Menu()

// Projects section
projects.attachHandlers()

// Todos section
todos.attachHandlers()

// Dones section
dones.attachHandlers()

// Menu section
menu.attachHandlers()

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
    const doneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-violet-700', '<i class="fa-solid fa-check"></i>', () => {
        todos.markAsDone(data)
    }, 'done-button', 'Mark as done')

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
    const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', () => {
        dones.markAsUndone(data)
    }, 'undone-button', 'Mark as undone')

    handleSwitch(dropped, 'bg-violet-700', 'bg-teal-600', undoneButton)

    const separator = createSeparator('bg-teal-200')

    dones.stack.container.append(separator, dropped)

    todos.dragAsDone(data)
})

// Footer
handleFooter()
