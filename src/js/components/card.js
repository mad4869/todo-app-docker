import Todos from "../home/todos"

import fetchData from "./data"

const createCard = (dataId, dataTitle, dataSubtitle, dataSubheading) => {
    // Create container of the card
    const container = document.createElement('div')
    container.className = 'w-full pb-2 border border-solid border-slate-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'

    // Create container for the task title and the project label
    const heading = document.createElement('div')
    heading.className = 'flex justify-between items-center px-4 py-2 bg-violet-700'

    // Create the task title
    const title = document.createElement('h1')
    // title.setAttribute('data-todoId', dataId)
    title.className = 'flex-1 text-xl text-white font-semibold'
    title.textContent = dataTitle

    // Create the project label
    const subtitle = document.createElement('span')
    subtitle.className = 'px-2 py-1 border border-solid border-white text-white text-sm rounded-full'
    subtitle.textContent = dataSubtitle

    // Insert the task title and project label to their container
    heading.append(title, subtitle)

    // Create container for the description
    const subheading = document.createElement('div')
    subheading.className = 'px-4 py-2 text-xs'
    subheading.textContent = dataSubheading

    // Create container for the buttons
    const toolbar = document.createElement('div')
    toolbar.className = 'flex justify-between px-4'

    // Create subcontainer for the buttons 
    const leftButtons = document.createElement('span')
    const rightButtons = document.createElement('span')

    // Create edit button
    const editButton = document.createElement('button')
    editButton.className = 'mr-1 px-2 py-px bg-teal-500 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] edit'
    editButton.textContent = 'Edit'
    editButton.addEventListener('click', async () => {
        const todos = new Todos()
        todos.showEditTodo()

        const data = await fetchData(`/api/todos/${dataId}`)
        document.getElementById('form-edit-todo-id').value = data.todo_id
        document.getElementById('form-edit-todo-project').value = data.project_id
        document.getElementById('form-edit-todo-title').value = data.title
        document.getElementById('form-edit-todo-description').value = data.description
    })

    // Create delete button
    const deleteButton = document.createElement('button')
    deleteButton.className = 'px-2 py-px bg-rose-600 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] delete'
    deleteButton.textContent = 'Delete'
    deleteButton.addEventListener('click', async () => {
        const todos = new Todos()
        todos.showDeleteTodo()

        const data = await fetchData(`/api/todos/${dataId}`)
        document.getElementById('modal-delete-todo-deleted').textContent = data.title
    })

    // Create mark as done button
    const doneButton = document.createElement('button')
    doneButton.className = 'px-4 py-px bg-violet-700 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
    doneButton.setAttribute('title', 'Mark as done')
    doneButton.innerHTML = '<i class="fa-solid fa-check"></i>'

    // Insert the buttons into their containers
    leftButtons.append(editButton, deleteButton)
    rightButtons.append(doneButton)

    // Insert the subcontainers into the container
    toolbar.append(leftButtons, rightButtons)

    // Insert all the components into the main container
    container.append(heading, subheading, toolbar)

    return container
}

export default createCard