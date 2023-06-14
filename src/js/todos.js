const getTodos = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/todos', true)
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 && xhr.status !== 0) {
                const res = JSON.parse(xhr.responseText)

                const todosContainer = document.getElementById('todos-container')
                for (let i = 0; i < res.length; i++) {
                    const todoContainer = document.createElement('div')
                    todoContainer.className = 'w-full pb-2 border border-solid border-violet-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'
                    const todoHeading = document.createElement('div')
                    todoHeading.className = 'flex justify-between items-center px-4 py-2 bg-violet-700'
                    const todoTitle = document.createElement('h1')
                    todoTitle.className = 'flex-1 text-xl text-white font-semibold'
                    todoTitle.textContent = JSON.stringify(res[i].title).split('"').join('')
                    const todoProjectContainer = document.createElement('span')
                    todoProjectContainer.className = 'px-2 py-1 border border-solid border-white rounded-full'
                    const todoProject = document.createElement('h3')
                    todoProject.className = 'text-white text-sm'
                    todoProject.textContent = JSON.stringify(res[i].project).split('"').join('')
                    todoProjectContainer.appendChild(todoProject)
                    todoHeading.append(todoTitle, todoProjectContainer)
                    const todoDescription = document.createElement('div')
                    todoDescription.className = 'px-4 py-2'
                    const todoDescriptionContent = document.createElement('p')
                    todoDescriptionContent.className = 'text-xs'
                    todoDescriptionContent.textContent = JSON.stringify(res[i].description).split('"').join('')
                    todoDescription.appendChild(todoDescriptionContent)
                    const separator = document.createElement('span')
                    separator.className = 'w-full h-px bg-violet-200'
                    const buttonsContainer = document.createElement('div')
                    buttonsContainer.className = 'flex justify-between px-4'
                    const leftButtons = document.createElement('span')
                    const rightButtons = document.createElement('span')
                    const editButton = document.createElement('button')
                    editButton.className = 'mr-1 px-2 py-px bg-teal-500 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
                    editButton.textContent = 'Edit'
                    const deleteButton = document.createElement('button')
                    deleteButton.className = 'px-2 py-px bg-rose-600 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
                    deleteButton.textContent = 'Delete'
                    const doneButton = document.createElement('button')
                    doneButton.className = 'px-4 py-px bg-violet-700 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
                    doneButton.setAttribute('title', 'Mark as done')
                    doneButton.innerHTML = '<i class="fa-solid fa-check"></i>'
                    leftButtons.append(editButton, deleteButton)
                    rightButtons.appendChild(doneButton)
                    buttonsContainer.append(leftButtons, rightButtons)
                    todoContainer.append(todoHeading, todoDescription, buttonsContainer)
                    todosContainer.append(separator, todoContainer)
                }
            } else {
                console.log('Request failed:', xhr.status)
            }
        }
    }
    xhr.send()
}

export default getTodos