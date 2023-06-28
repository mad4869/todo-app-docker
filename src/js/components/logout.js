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
    const logoutBox = document.getElementById('logout')
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault()

        logoutLink.classList.add('hidden')
        loadAnimation(logoutBox, 'dots')

        try {
            const { success } = await logout()
            if (success) {
                logoutBox.innerHTML = logoutLink.outerHTML
                logoutLink.classList.remove('hidden')
                window.location.replace('/')
            } else {
                logoutBox.innerHTML = logoutLink
                logoutLink.classList.remove('hidden')
                showNotice('Failed to log you out. Please try again.', 'error')
            }
        } catch (err) {
            console.error(err)
        }
    })
}

export default handleLogout