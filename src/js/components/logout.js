import loadAnimation from "./animation"
import showNotice from "./notice"

// Get the JWT access token from the local storage
const accessToken = localStorage.getItem('access_token')

// Handle a POST request to the logout endpoint with access token attached on the header
// Get the response and return a Promise
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

// Handle the logout procedure
const handleLogout = () => {
    const logoutLink = document.querySelector('a[href="/auth/logout"]')

    // The user clicks the logout link
    logoutLink.addEventListener('click', async (e) => {
        // Prevent the browser to refresh the page
        e.preventDefault()

        // Display loading state
        logoutLink.innerHTML = ''
        loadAnimation(logoutLink, 'dots')

        // Make an API call the logout endpoint
        try {
            const { success } = await logout()
            // If the user logs out successfully, redirect the user to the landing page
            if (success) {
                window.location.replace('/')
                // If the user fails to log out, abort the loading state and show a notice
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