import '../../css/style.css'

import User from './user'
import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/profile') {
    // Logged in user
    const userId = document.getElementById('current-user').dataset.user

    // User profile
    const user = new User()
    user.getProfile(userId)

    user.profile.addEventListener('focus', (e) => {
        if (e.target.hasAttribute('contenteditable')) {
            user.update.classList.remove('hidden')
        }
    }, true)

    user.update.addEventListener('click', () => {
        user.updateProfile(userId)
    })

    // User tasks details
    user.getTasksStats(userId)

    // Footer
    setInterval(setClock, 1000)
    showYear()
}