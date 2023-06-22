import Projects from "../projects/projects"

const createEmptyState = (cat) => {
    const emptyBox = document.createElement('div')
    const text = document.createElement('h3')
    const illustration = document.createElement('img')

    emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full border border-dashed py-10 text-xl capitalize rounded-2xl'

    illustration.className = 'w-20'
    illustration.setAttribute('alt', 'This column is empty')

    switch (cat) {
        case 'projects':
            emptyBox.classList.add('border-white', 'text-white')
            text.textContent = "you haven't added any projects yet"

            const projectButton = document.createElement('button')
            projectButton.setAttribute('id', 'home-projects-get-started')
            projectButton.textContent = 'get started'
            projectButton.className = 'bg-white mt-8 px-4 py-1 text-indigo-700 font-semibold rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase'

            emptyBox.append(text, projectButton)
            break
        case 'todos':
            emptyBox.classList.add('border-violet-700', 'text-violet-700')
            illustration.setAttribute('src', '/static/dist/img/empty-primary.svg')
            text.textContent = "you haven't added any tasks yet"

            const todosButton = document.createElement('button')
            todosButton.setAttribute('id', 'home-todos-get-started')
            todosButton.textContent = 'get started'
            todosButton.className = 'bg-violet-700 mt-8 px-4 py-1 text-white font-semibold rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase'

            emptyBox.append(illustration, text, todosButton)
            break
        case 'dones':
            emptyBox.classList.add('border-teal-700', 'text-teal-700')
            illustration.setAttribute('src', '/static/dist/img/empty-secondary.svg')
            text.textContent = "you haven't finished any tasks yet"

            emptyBox.append(illustration, text)
            break
        default:
            return
    }

    return emptyBox
}

const createCardEmptyState = (dataId) => {
    const emptyBox = document.createElement('li')
    emptyBox.className = 'mx-auto'

    const button = document.createElement('button')
    button.className = 'flex gap-2 items-center px-4 py-1 text-indigo-700 font-semibold border border-dashed border-indigo-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase'
    button.innerHTML = '<i class="fa-solid fa-circle-plus fa-sm text-indigo-700"></i><span>add your first task</span>'
    button.addEventListener('click', () => {
        const projects = new Projects()
        projects.showAddTodo()

        document.getElementById('form-add-todo-project').value = dataId
    })

    emptyBox.append(button)

    return emptyBox
}

export { createEmptyState, createCardEmptyState }