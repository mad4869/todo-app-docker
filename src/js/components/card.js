import Projects from "../projects/projects"

import { fetchData } from "./data"
import createButton from "./button"
import createList from "./list"

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

export { createProjectCard }