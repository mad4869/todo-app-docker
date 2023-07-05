import '../../css/style.css'

import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'

import { handleFlash } from '../components/notice'
import handleHamburger from '../components/hamburger'
import handleLogout from '../components/logout'
import setFooter from '../components/footer'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Mobile screen
handleHamburger()

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// Object instances with the logged in user data
const projects = new Projects(userId)
const todos = new Todos(userId)
const dones = new Dones(userId)
const menu = new Menu()

// Dropdown
projects.handleOptions()

// Stacks

// Show the loading state
const loading = document.getElementById('home-loading')
loadAnimation(loading, 'loading')

const todoStack = todos.handleStack()
const doneStack = dones.handleStack()
if (todoStack & doneStack) {
    // After getting the stacks, hide the loading state
    loading.classList.add('hidden')
}

// Menu
menu.handleMenu()

// Modals
projects.handleModal()
todos.handleModal()

// Forms
todos.handleForm()
projects.handleForm()

// Footer
setFooter()