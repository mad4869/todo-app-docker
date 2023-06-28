import '../../css/style.css'

import Projects from './projects'
import { handleFlash } from '../components/notice'
import handleFooter from '../components/footer'
import handleLogout from '../components/logout'


// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Active link
const link = document.querySelector('a[href=" /projects"]')
link.classList.add('text-teal-400')

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// Project object instance with the logged in user data
const projects = new Projects(userId)

// Get all the user's projects elements with their event listeners
projects.getStack()
projects.attachHandlers()

// Footer
handleFooter()