import Todos from "../home/todos"
import Dones from '../home/dones'

import fetchData from "./data"
import createButton from "./button"
import createSeparator from "./separator"

const createCard = (dataId, dataTitle, dataSubtitle, dataSubheading, category) => {
    // Create container of the card
    const container = document.createElement('div')
    container.className = 'w-full pb-2 bg-white border border-solid border-slate-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'
    container.setAttribute('draggable', true)
    container.setAttribute('data-id', dataId)

    // Create container for the task title and the project label
    const heading = document.createElement('div')
    heading.className = 'flex justify-between items-center px-4 py-2'

    // Create the task title
    const title = document.createElement('h1')
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
    subheading.className = 'bg-white px-4 py-2 text-xs'
    subheading.textContent = dataSubheading

    // Create container for the buttons
    const toolbar = document.createElement('div')
    toolbar.className = 'flex justify-between bg-white px-4'

    // Create subcontainer for the buttons 
    const leftButtons = document.createElement('span')
    const rightButtons = document.createElement('span')

    // Create edit button
    const handleEdit = async () => {
        const todos = new Todos()
        todos.showEditTodo()

        // Fetch data to fill the form field with the task details
        const data = await fetchData(`/api/todos/${dataId}`)
        document.getElementById('form-edit-todo-id').value = data.todo_id
        document.getElementById('form-edit-todo-project').value = data.project_id
        document.getElementById('form-edit-todo-title').value = data.title
        document.getElementById('form-edit-todo-description').value = data.description
    }

    const editButton = createButton('bg-emerald-700', 'Edit', handleEdit)

    // Create delete button
    const handleDelete = async () => {
        const todos = new Todos()
        todos.showDeleteTodo()

        // Fetch data to fill the confirmation prompt with the task title
        const data = await fetchData(`/api/todos/${dataId}`)
        todos.deleteTodoDeleted.textContent = data.title

        // Bind event listener to the confirm button to execute the deletion process
        todos.deleteTodoConfirm.addEventListener('click', function () {
            todos.deleteTodo(dataId)
        })

        // Bind event listener to the cancel button to close the delete modal
        todos.deleteTodoCancel.addEventListener('click', function () {
            todos.closeDeleteTodo()
        })
    }

    const deleteButton = createButton('bg-rose-700', 'Delete', handleDelete)
    deleteButton.classList.add('ml-1')

    leftButtons.append(editButton, deleteButton)

    switch (category) {
        case 'todos':
            heading.classList.add('bg-violet-700')

            // Create mark as done button
            const handleDone = () => {
                const todos = new Todos()
                todos.markAsDone(dataId)

                container.previousElementSibling.remove()
                container.remove()

                const newContainer = createCard(dataId, dataTitle, dataSubtitle, dataSubheading, 'dones')
                const newSeparator = createSeparator('bg-teal-200')
                const dones = new Dones()
                dones.container.append(newSeparator, newContainer)
            }

            const doneButton = createButton('bg-violet-700', '<i class="fa-solid fa-check"></i>', handleDone, 'done-button', 'Mark as done')

            rightButtons.append(doneButton)
            break
        case 'dones':
            heading.classList.add('bg-teal-600')

            // Create mark as undone button
            const handleUndone = () => {
                const dones = new Dones()
                dones.markAsUndone(dataId)

                container.previousElementSibling.remove()
                container.remove()

                const newContainer = createCard(dataId, dataTitle, dataSubtitle, dataSubheading, 'todos')
                const newSeparator = createSeparator('bg-violet-200')
                const todos = new Todos()
                todos.container.append(newSeparator, newContainer)
            }

            const undoneButton = createButton('bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', handleUndone, 'undone-button', 'Mark as undone')

            rightButtons.append(undoneButton)
            break
        default:
            return
    }

    // Insert the subcontainers into the container
    toolbar.append(leftButtons, rightButtons)

    // Insert all the components into the main container
    container.append(heading, subheading, toolbar)

    return container
}

export default createCard