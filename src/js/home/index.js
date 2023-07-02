import '../../css/style.css'

import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'

import { handleFlash } from '../components/notice'
import handleLogout from '../components/logout'
import setFooter from '../components/footer'

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
projects.handleOptions()
projects.handleModal()
projects.handleForm()

// Todos section
todos.handleStack()
todos.handleModal()
todos.handleForm()

// Dones section
dones.handleStack()

// Menu section
menu.handleMenu()

// Footer
setFooter()