// Get the JWT access token from the local storage
let accessToken = localStorage.getItem('access_token')

// Attach the token on the header of each request
// Get the response of each request and return a Promise

const refresh = () => {
    const refreshToken = localStorage.getItem('refresh_token')

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', '/auth/refresh', true)
        xhr.setRequestHeader('Authorization', `Bearer ${refreshToken}`)

        xhr.onload = () => {
            if (xhr.status === 201) {
                const { access_token } = JSON.parse(xhr.responseText)

                localStorage.setItem('access_token', access_token)
                resolve(access_token)
            } else {
                reject(new Error('Failed to get access token'))
            }
        }

        xhr.send()
    })
}

// Handle the GET request
// Params: url (string) -> the url/route of the api endpoint
// Return: Promise -> a promise containing the response of the request
const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', url, true)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.onload = async () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else if (xhr.status === 401) {
                accessToken = await refresh()

                xhr.open('GET', url, true)
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
                xhr.send()
            } else {
                reject(new Error('Failed to fetch data'))
            }
        }

        xhr.send()
    })
}

// Handle the POST request
// Params: url (string) -> the url/route of the api endpoint
//         newData (object) -> an object containing new data from the user
// Return: Promise -> a promise containing the response of the request
const sendData = (url, newData) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', url, true)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.onload = async () => {
            if (xhr.status === 201 || xhr.status === 400) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else if (xhr.status === 401) {
                accessToken = await refresh()

                xhr.open('POST', url, true)
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
                xhr.send(newData)
            } else {
                reject(new Error('Failed to send data'))
            }
        }

        xhr.send(newData)
    })
}

// Handle the PUT request
// Params: url (string) -> the url/route of the api endpoint
//         updatedData (object) -> an object containing data that has been updated by the user
// Return: Promise -> a promise containing the response of the request
const updateData = (url, updatedData) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('PUT', url, true)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.onload = async () => {
            if (xhr.status === 201) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else if (xhr.status === 401) {
                accessToken = await refresh()

                xhr.open('PUT', url, true)
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
                xhr.send(updatedData)
            } else {
                reject(new Error('Failed to update data'))
            }
        }

        xhr.send(updatedData)
    })
}

// Handle the DELETE request
// Params: url (string) -> the url/route of the api endpoint
// Return: Promise -> a promise containing the response of the request
const deleteData = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('DELETE', url, true)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.onload = async () => {
            if (xhr.status === 201) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else if (xhr.status === 401) {
                accessToken = await refresh()

                xhr.open('DELETE', url, true)
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
                xhr.send()
            } else {
                reject(new Error('Failed to delete data'))
            }
        }

        xhr.send()
    })
}

export { fetchData, sendData, updateData, deleteData }