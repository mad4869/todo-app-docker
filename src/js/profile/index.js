import '../../css/style.css'

import User from './user'
import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/profile') {
    // Active link on the navbar
    const link = document.querySelector('a[href="/profile"]')
    link.classList.add('text-teal-400')

    // Logged in user
    const userId = document.getElementById('current-user').dataset.user

    // User profile
    const user = new User(userId)
    user.getProfile()
    user.attachEventListeners()

    // User tasks details
    user.getTasksDetails()

    // Footer
    setInterval(setClock, 1000)
    showYear()
}