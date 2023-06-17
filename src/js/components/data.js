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

export default fetchData