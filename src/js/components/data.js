// Get the JWT access token from the local storage
const accessToken = localStorage.getItem('access_token')

// Attach the token on the header of each request
// Get the response of each request and return a Promise

// Handle the GET request
// Params: url (string) -> the url/route of the api endpoint
// Return: Promise -> a promise containing the response of the request
const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', url, true)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
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

        xhr.onload = () => {
            if (xhr.status === 201 || xhr.status === 400) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
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

        xhr.onload = () => {
            if (xhr.status === 201) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
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

        xhr.onload = () => {
            if (xhr.status === 201) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else {
                reject(new Error('Failed to delete data'))
            }
        }

        xhr.send()
    })
}

export { fetchData, sendData, updateData, deleteData }