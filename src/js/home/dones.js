// import Todos from './todos'

import { fetchData, updateData, deleteData } from '../components/data'
import createButton from '../components/button'
import createSeparator from '../components/separator'
import showNotice from '../components/notice'
import infoAnimation from '../../animations/info.json'
import alertAnimation from '../../animations/alert.json'

class Dones {
    constructor(user) {
        this.user = user

        this.stack = {
            container: document.getElementById('home-dones-container'),
            heading: document.getElementById('home-dones-heading')
        }

        this.edit = {
            modal: document.getElementById('modal-edit-todo'),
            form: {
                form: document.getElementById('form-edit-todo'),
                fields: {
                    id: document.getElementById('form-edit-todo-id'),
                    project: document.getElementById('form-edit-todo-project'),
                    title: document.getElementById('form-edit-todo-title'),
                    description: document.getElementById('form-edit-todo-description')
                },
                submit: document.getElementById('form-edit-todo-submit')
            },
            close: document.getElementById('modal-edit-todo-close-button')
        }

        this.delete = {
            modal: document.getElementById('modal-delete-todo'),
            deleted: document.getElementById('modal-delete-todo-deleted'),
            confirm: document.getElementById('modal-delete-todo-confirm'),
            cancel: document.getElementById('modal-delete-todo-cancel'),
            close: document.getElementById('modal-delete-todo-close-button')
        }
    }

    attachEventListeners = () => {
        this.stack.container.addEventListener('dragenter', (e) => {
            e.preventDefault()
            this.stack.container.classList.add('bg-teal-300')
        })
        this.stack.container.addEventListener('dragover', (e) => {
            e.preventDefault()
            this.stack.container.classList.add('bg-teal-300')
        })
        this.stack.container.addEventListener('dragleave', (e) => {
            e.preventDefault()
            this.stack.container.classList.remove('bg-teal-300')
        })
    }

    createCard = (doneId) => {
        const card = document.createElement('div')
        card.className = 'w-full pb-2 bg-white border border-solid border-slate-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'
        card.setAttribute('draggable', true)
        card.setAttribute('data-id', doneId)

        return card
    }

    createHeading = (doneTitle, project) => {
        const heading = document.createElement('div')
        heading.className = 'flex justify-between items-center bg-teal-600 px-4 py-2'

        const title = document.createElement('h1')
        title.className = 'flex-1 text-xl text-white font-semibold'
        title.textContent = doneTitle

        const label = document.createElement('span')
        label.className = 'px-2 py-1 border border-solid border-white text-white text-sm rounded-full'
        label.textContent = project

        heading.append(title, label)

        return heading
    }

    createDescription = (doneDesc) => {
        const description = document.createElement('div')
        description.className = 'bg-white px-4 py-2 text-xs'
        description.textContent = doneDesc

        return description
    }

    createToolbar = (editButton, deleteButton, undoneButton) => {
        const toolbar = document.createElement('div')
        toolbar.className = 'flex justify-between bg-white px-4'

        const leftButtons = document.createElement('span')
        const rightButtons = document.createElement('span')

        leftButtons.append(editButton, deleteButton)
        rightButtons.append(undoneButton)

        toolbar.append(leftButtons, rightButtons)

        return toolbar
    }

    createDone = (doneId, doneTitle, project, doneDesc) => {
        const card = this.createCard(doneId)
        const heading = this.createHeading(doneTitle, project)
        const description = this.createDescription(doneDesc)

        const handleEdit = async () => {
            this.showEditDone()

            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            this.edit.form.fields.id.value = data.todo_id
            this.edit.form.fields.project.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description
        }

        const handleDelete = async () => {
            this.showDeleteDone()

            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            this.delete.deleted.textContent = data.title

            this.delete.confirm.addEventListener('click', () => {
                this.deleteDone(doneId)
                this.closeDeleteDone()
            })

            this.delete.cancel.addEventListener('click', () => {
                this.closeDeleteDone()
            })
        }

        const handleUndone = () => {
            this.markAsUndone(doneId)
        }

        const editButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-emerald-700', 'Edit', handleEdit, 'edit-button', 'Edit this task')
        const deleteButton = createButton('ml-1 px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-rose-700', 'Delete', handleDelete, 'delete-button', 'Delete this task')
        const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', handleUndone, 'undone-button', 'Mark as undone')

        const toolbar = this.createToolbar(editButton, deleteButton, undoneButton)

        card.append(heading, description, toolbar)

        return card
    }

    createStack = (data) => {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].todo_id
            const title = data[i].title
            const project = data[i].project_title
            const description = data[i].description

            const done = this.createDone(id, title, project, description)

            const separator = createSeparator('bg-teal-200')

            this.stack.container.append(separator, done)
        }
    }

    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/dones`)

            this.createStack(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    deleteDone = async (doneId) => {
        try {
            const { success } = await deleteData(`/api/users/${this.user}/todos/${doneId}`);
            if (success) {
                showNotice('Your task has been deleted!', 'error', alertAnimation)
            }
        } catch (err) {
            console.error(err);
        }
    }

    markAsUndone = async (doneId) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            const updatedData = {
                ...data,
                is_done: false,
            }

            const { success } = await updateData(`/api/users/${this.user}/todos/${doneId}`, JSON.stringify(updatedData))
            if (success) {
                showNotice('You have undone your finished task!', 'info', infoAnimation)
            }
        } catch (err) {
            console.error(err)
        }
    }

    dragAsUndone = async (doneId) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            const updatedData = {
                ...data,
                is_done: false,
            }
            const dataToSend = JSON.stringify(updatedData)

            const { success } = await updateData(`/api/users/${this.user}/todos/${doneId}`, dataToSend)
            if (success) {
                showNotice('You have undone your finished task!', 'info', infoAnimation)
            }
        } catch (err) {
            console.error(err)
        }
    }

    filterByProjects = async (projectId) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/dones`)

            while (this.stack.container.hasChildNodes()) {
                this.stack.container.removeChild(this.stack.container.firstChild)
            }

            this.stack.container.appendChild(this.stack.heading)

            const filtered = data.filter((done) => {
                return done.project_id === parseInt(projectId)
            })

            this.createStack(filtered)
        } catch (err) {
            console.error(err)
        }
    }

    showEditDone = () => {
        this.edit.modal.classList.remove('hidden')
    }

    closeEditDone = () => {
        this.edit.modal.classList.add('hidden')
    }

    showDeleteDone = () => {
        this.delete.modal.classList.remove('hidden')
    }

    closeDeleteDone = () => {
        this.delete.modal.classList.add('hidden')
    }

    emptyState() {
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-teal-600 text-teal-600 text-xl capitalize rounded-2xl'

        const illustration = document.createElement('img')
        illustration.className = 'w-20'
        illustration.setAttribute('alt', 'This column is empty')
        illustration.setAttribute('src', '/static/dist/img/empty-secondary.svg')

        const text = document.createElement('h3')
        text.textContent = "you haven't finished any tasks yet"

        emptyBox.append(illustration, text)

        const separator = createSeparator('bg-teal-200')

        this.stack.container.append(separator, emptyBox)
    }
}

export default Dones