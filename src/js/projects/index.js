import '../../css/style.css'

import Projects from './projects'
import active from '../components/active'
import { handleFlash } from '../components/notice'
import handleLogout from '../components/logout'
import setFooter from '../components/footer'


// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Active link
active('/projects')

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
setFooter()