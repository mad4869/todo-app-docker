const accessToken = localStorage.getItem('access_token')

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

export { fetchData, sendData, updateData, deleteData, logout }