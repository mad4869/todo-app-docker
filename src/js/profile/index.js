import '../../css/style.css'

import User from './user'
import active from '../components/active'
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

// Active link
active('/profile')

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// User object instance with the logged in user data
const user = new User(userId)

// Get all user details and their handlers
user.getProfile()
user.attachHandlers()

// Get user's tasks details
user.getTasksDetails()

// Footer
setFooter()