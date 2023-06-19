const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else {
                reject(new Error('Failed to fetch data'))
            }
        }

        xhr.open('GET', url, true)
        xhr.send()
    })
}

const updateData = (url, updatedData) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            if (xhr.status === 201) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else {
                reject(new Error('Failed to update data'))
            }
        }

        xhr.open('PUT', url, true)
        xhr.send(JSON.stringify(updatedData))
    })
}

const deleteData = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
            if (xhr.status === 201) {
                const res = JSON.parse(xhr.responseText)
                resolve(res)
            } else {
                reject(new Error('Failed to delete data'))
            }
        }

        xhr.open('DELETE', url, true)
        xhr.send()
    })
}

export default fetchData
export { updateData, deleteData }