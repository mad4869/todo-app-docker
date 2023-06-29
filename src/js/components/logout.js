import loadAnimation from "./animation"
import showNotice from "./notice"

const accessToken = localStorage.getItem('access_token')

const logout = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', '/auth/logout', true)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else {
                reject(new Error('Failed to logout'))
            }
        }

        xhr.send()
    })
}

const handleLogout = () => {
    const logoutLink = document.querySelector('a[href="/auth/logout"]')
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault()

        logoutLink.innerHTML = ''
        loadAnimation(logoutLink, 'dots')

        try {
            const { success } = await logout()
            if (success) {
                logoutLink.innerHTML = 'Logout'

                window.location.replace('/')
            } else {
                logoutLink.innerHTML = 'Logout'

                showNotice('Failed to log you out. Please try again.', 'error')
            }
        } catch (err) {
            console.error(err)
        }
    })
}

export default handleLogout