import '../../css/style.css'

import User from './user'
import { handleFlash } from '../components/notice'
import handleFooter from '../components/footer'
import handleLogout from '../components/logout'


// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Active link
const link = document.querySelector('a[href="/profile"]')
link.classList.add('text-teal-400')

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// User object instance with the logged in user data
const user = new User(userId)

// Get all user details and their event listeners
user.getProfile()
user.attachEventListeners()

// Get user's tasks details
user.getTasksDetails()

// Footer
handleFooter()