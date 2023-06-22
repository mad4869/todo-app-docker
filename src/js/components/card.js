import Todos from "../home/todos"
import Dones from '../home/dones'
import Projects from "../projects/projects"

import fetchData from "./data"
import createButton from "./button"
import createList from "./list"
import createSeparator from "./separator"

const createTodoCard = (dataId, dataTitle, dataLabel, dataDescription, category) => {
    const todos = new Todos()
    const dones = new Dones()

    // Create container of the card
    const card = document.createElement('div')
    card.className = 'w-full pb-2 bg-white border border-solid border-slate-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'
    card.setAttribute('draggable', true)
    card.setAttribute('data-id', dataId)

    // Create container for the task title and the project label
    const heading = document.createElement('div')
    heading.className = 'flex justify-between items-center px-4 py-2'

    // Create the task title
    const title = document.createElement('h1')
    title.className = 'flex-1 text-xl text-white font-semibold'
    title.textContent = dataTitle

    // Create the project label
    const label = document.createElement('span')
    label.className = 'px-2 py-1 border border-solid border-white text-white text-sm rounded-full'
    label.textContent = dataLabel

    // Insert the task title and project label to their container
    heading.append(title, label)

    // Create container for the description
    const description = document.createElement('div')
    description.className = 'bg-white px-4 py-2 text-xs'
    description.textContent = dataDescription

    // Create container for the buttons
    const toolbar = document.createElement('div')
    toolbar.className = 'flex justify-between bg-white px-4'

    // Create subcontainer for the buttons 
    const leftButtons = document.createElement('span')
    const rightButtons = document.createElement('span')

    // Create edit button
    const handleEdit = async () => {

        todos.showEditTodo()

        // Fetch data to fill the form field with the task details
        const data = await fetchData(`/api/todos/${dataId}`)
        document.getElementById('form-edit-todo-id').value = data.todo_id
        document.getElementById('form-edit-todo-project').value = data.project_id
        document.getElementById('form-edit-todo-title').value = data.title
        document.getElementById('form-edit-todo-description').value = data.description
    }

    const editButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-emerald-700', 'Edit', handleEdit, '', 'Edit this task')

    // Create delete button
    const handleDelete = async () => {
        todos.showDeleteTodo()

        // Fetch data to fill the confirmation prompt with the task title
        const data = await fetchData(`/api/todos/${dataId}`)
        todos.deleteTodoDeleted.textContent = data.title

        // Bind event listener to the confirm button to execute the deletion process
        todos.deleteTodoConfirm.addEventListener('click', () => {
            todos.deleteTodo(dataId)
        })

        // Bind event listener to the cancel button to close the delete modal
        todos.deleteTodoCancel.addEventListener('click', () => {
            todos.closeDeleteTodo()
        })
    }

    const deleteButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-rose-700', 'Delete', handleDelete, '', 'Delete this task')
    deleteButton.classList.add('ml-1')

    leftButtons.append(editButton, deleteButton)

    switch (category) {
        case 'todos':
            heading.classList.add('bg-violet-700')

            // Create mark as done button
            const handleDone = () => {
                todos.markAsDone(dataId)

                card.previousElementSibling.remove()
                card.remove()

                const newCard = createCard(dataId, dataTitle, dataLabel, dataDescription, 'dones')
                const newSeparator = createSeparator('bg-teal-200')

                dones.container.append(newSeparator, newCard)
            }

            const doneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-violet-700', '<i class="fa-solid fa-check"></i>', handleDone, 'done-button', 'Mark as done')

            rightButtons.append(doneButton)
            break
        case 'dones':
            heading.classList.add('bg-teal-600')

            // Create mark as undone button
            const handleUndone = () => {
                dones.markAsUndone(dataId)

                card.previousElementSibling.remove()
                card.remove()

                const newCard = createCard(dataId, dataTitle, dataLabel, dataDescription, 'todos')
                const newSeparator = createSeparator('bg-violet-200')

                todos.container.append(newSeparator, newCard)
            }

            const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', handleUndone, 'undone-button', 'Mark as undone')

            rightButtons.append(undoneButton)
            break
        default:
            return
    }

    // Insert the subcontainers into the container
    toolbar.append(leftButtons, rightButtons)

    // Insert all the components into the main container
    card.append(heading, description, toolbar)

    return card
}

const createProjectCard = (dataId, dataTitle, dataDescription, dataList) => {
    const projects = new Projects()

    const card = document.createElement('div')
    card.className = 'flex flex-col bg-white rounded-2xl border border-solid border-indigo-700'
    card.setAttribute('data-id', dataId)

    const heading = document.createElement('div')
    heading.className = 'flex justify-between items-center px-4 bg-indigo-700 text-white rounded-t-2xl group'

    const content = document.createElement('div')
    content.className = 'flex-1 pr-4 py-2'

    const title = document.createElement('p')
    title.className = 'text-2xl font-semibold'
    title.textContent = dataTitle

    const description = document.createElement('p')
    description.textContent = dataDescription

    content.append(title, description)

    const buttons = document.createElement('div')
    buttons.className = 'flex gap-2'

    const handleEdit = async () => {
        projects.showEditProject()

        const data = await fetchData(`/api/projects/${dataId}`)
        document.getElementById('form-edit-project-id').value = data.project_id
        document.getElementById('form-edit-project-title').value = data.title
        document.getElementById('form-edit-project-description').value = data.description
    }

    const editButton = createButton('invisible group-hover:visible hover:text-emerald-500', '<i class="fa-solid fa-pen-to-square fa-sm"></i>', handleEdit, '', 'Edit this project')

    const handleDelete = async () => {
        projects.showDeleteProject()

        const data = await fetchData(`/api/projects/${dataId}`)
        projects.deleteProjectDeleted.textContent = data.title

        // Bind event listener to the confirm button to execute the deletion process
        projects.deleteProjectConfirm.addEventListener('click', () => {
            projects.deleteProject(dataId)
        })

        // Bind event listener to the cancel button to close the delete modal
        projects.deleteProjectCancel.addEventListener('click', () => {
            projects.closeDeleteProject()
        })
    }

    const deleteButton = createButton('invisible group-hover:visible hover:text-rose-500', '<i class="fa-solid fa-trash fa-sm"></i>', handleDelete, '', 'Delete this project')

    const handleAdd = () => {
        projects.showAddTodo()

        document.getElementById('form-add-todo-project').value = dataId
    }

    const addButton = createButton('invisible group-hover:visible hover:text-violet-500', '<i class="fa-solid fa-circle-plus fa-sm">', handleAdd, '', 'Add a new task')

    buttons.append(editButton, deleteButton, addButton)

    heading.append(content, buttons)

    const todos = createList(dataList)

    card.append(heading, todos)

    return card
}

export { createTodoCard, createProjectCard }