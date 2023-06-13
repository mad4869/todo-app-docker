const getProjects = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/projects', true)
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 && xhr.status !== 0) {
                const res = JSON.parse(xhr.responseText)

                const dropdownProjectContainer = document.getElementById('dropdown-project-items')
                for (let i = 0; i < res.length; i++) {
                    const dropdownProjectItems = document.createElement('span')
                    dropdownProjectItems.className = "w-full text-center border-b border-solid border-violet-500 py-2 hover:bg-teal-600 hover:rounded-t-2xl"
                    dropdownProjectItems.textContent = JSON.stringify(res[i].title).split('"').join('')
                    dropdownProjectContainer.appendChild(dropdownProjectItems)
                }
                dropdownProjectContainer.lastChild.classList.remove('border-b')
            } else {
                console.log('Request failed:', xhr.status)
            }
        }
    }
    xhr.send()
}

export default getProjects