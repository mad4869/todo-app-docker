import Todos from './todos'

import { fetchData, updateData, deleteData } from '../components/data'
import createButton from '../components/button'
import { getNextElement, todoToDone } from '../components/switch'
import loadAnimation from '../components/animation'

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

    createCard = (doneId) => {
        const card = document.createElement('div')
        card.className = 'w-full pb-2 bg-white border border-solid border-slate-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] cursor-move overflow-hidden'
        card.setAttribute('draggable', true)
        card.setAttribute('data-id', doneId)

        return card
    }

    createHeading = (doneTitle, project) => {
        const heading = document.createElement('div')
        heading.className = 'flex justify-between items-center bg-teal-600 px-4 py-2 text-teal-500 '

        const title = document.createElement('h1')
        title.className = 'flex-1 text-xl font-semibold'
        title.textContent = doneTitle

        const label = document.createElement('span')
        label.className = 'px-2 py-1 border border-solid border-teal-500 text-sm rounded-full'
        label.textContent = project

        heading.append(title, label)

        return heading
    }

    createDescription = (doneDesc) => {
        const description = document.createElement('div')
        description.className = 'bg-white px-4 py-2 text-neutral-400 text-xs'
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
            this.showEditModal()

            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            this.edit.form.fields.id.value = data.todo_id
            this.edit.form.fields.project.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description
        }

        const handleDelete = async () => {
            this.showDeleteModal()

            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            this.delete.deleted.textContent = data.title

            this.delete.confirm.addEventListener('click', async () => {
                this.delete.confirm.innerHTML = ''
                loadAnimation(this.delete.confirm, 'dots')

                try {
                    const res = await deleteData(`/api/users/${this.user}/todos/${doneId}`)
                    if (res.success) {
                        location.reload()
                    } else {
                        this.delete.confirm.innerHTML = 'Confirm'
                        this.closeDeleteModal()

                        showNotice(res.message, 'error')
                    }
                } catch (err) {
                    console.error(err)
                }
            })

            this.delete.cancel.addEventListener('click', () => {
                this.closeDeleteModal()
            })
        }

        this.handleUndone = async () => {
            const todo = document.querySelector(`[data-id="${doneId}"]`)
            const undoneButton = todo.querySelector('button[name="undone-button"]')

            undoneButton.innerHTML = ''
            loadAnimation(undoneButton, 'dots')

            try {
                const updatedData = await this.markAsUndone(doneId)
                if (updatedData) {
                    const res = await updateData(`/api/users/${this.user
                        }/todos/${doneId}`, JSON.stringify(updatedData))

                    if (res.success) {
                        location.reload()
                    } else {
                        undoneButton.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>'

                        showNotice(res.message, 'error')
                    }
                }
            } catch (err) {
                console.error(err)
            }
        }

        const editButton = createButton('px-4 py-px text-xs text-emerald-500 rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-emerald-700', 'Edit', handleEdit, 'edit-button', 'Edit this task')
        const deleteButton = createButton('ml-1 px-4 py-px text-xs text-rose-500 rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-rose-700', 'Delete', handleDelete, 'delete-button', 'Delete this task')
        const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', this.handleUndone, 'undone-button', 'Mark as undone')

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

            this.stack.container.append(done)
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

    emptyState() {
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-teal-600 text-teal-600 text-xl capitalize rounded-2xl'
        emptyBox.setAttribute('id', 'empty-state')

        const illustration = document.createElement('img')
        illustration.className = 'w-20'
        illustration.setAttribute('alt', 'This column is empty')
        illustration.setAttribute('src', '/static/dist/img/empty-secondary.svg')

        const text = document.createElement('h3')
        text.textContent = "you haven't finished any tasks yet"

        emptyBox.append(illustration, text)

        this.stack.container.append(emptyBox)
    }

    checkDone = async (todoId) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user
                }/todos/${todoId}`)

            if (data.is_done) {
                return data
            }
        } catch (err) {
            console.error(err)
        }
    }

    markAsUndone = async (doneId) => {
        try {
            const data = await this.checkDone(doneId)
            if (data) {
                const updatedData = {
                    ...data,
                    is_done: false,
                }

                return updatedData
            }
        } catch (err) {
            console.error(err)
        }
    }

    handleDragSender = () => {
        this.handleDragStart = (e) => {
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'))

            e.target.classList.add('opacity-50');
        }

        this.handleDragEnd = (e) => {
            e.target.classList.remove('opacity-50')
        }

        const allTasks = document.querySelectorAll('div[draggable="true"]')
        allTasks.forEach((task) => {
            task.addEventListener('dragstart', this.handleDragStart)
            task.addEventListener('dragend', this.handleDragEnd)
        })
    }

    handleDragRecipient = () => {
        this.handleDragEnterOver = (e) => {
            e.preventDefault()

            const data = e.dataTransfer.getData('text/plain')

            const dropped = document.querySelector(`[data-id="${data}"]`)

            const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', this.handleUndone, 'undone-button', 'Mark as undone')

            todoToDone(dropped, undoneButton)

            const { nextElement } = getNextElement(this.stack.container, e.clientY)

            if (this.stack.container.contains(document.getElementById('empty-state'))) {
                this.stack.container.replaceChild(dropped, document.getElementById('empty-state'))
            }

            if (!nextElement) {
                this.stack.container.append(dropped)
            } else {
                this.stack.container.insertBefore(dropped, nextElement)
            }

            const todos = new Todos(this.user)
            if (!todos.stack.heading.nextElementSibling) {
                todos.emptyState()
            }
        }

        this.handleDrop = async (e) => {
            e.preventDefault()

            const data = e.dataTransfer.getData('text/plain')

            const todos = new Todos(this.user)
            const updatedData = await todos.markAsDone(data)
            if (updatedData) {
                this.stack.heading.innerHTML = ''
                loadAnimation(this.stack.heading, 'loading')

                const res = await updateData(`/api/users/${this.user
                    }/todos/${data}`, JSON.stringify(updatedData))

                if (res.success) {
                    location.reload()
                } else {
                    this.stack.heading.innerHTML = 'Done'

                    showNotice(res.message, 'error')
                }
            }
        }

        this.stack.container.addEventListener('dragover', this.handleDragEnterOver)
        this.stack.container.addEventListener('drop', this.handleDrop)
    }

    resetDrag = () => {
        const allTasks = document.querySelectorAll('div[draggable="true"]')
        allTasks.forEach((task) => {
            task.removeEventListener('dragstart', this.handleDragStart)
            task.removeEventListener('dragend', this.handleDragEnd)
        })

        // this.stack.container.removeEventListener('dragenter', this.handleDragEnterOver)
        this.stack.container.removeEventListener('dragover', this.handleDragEnterOver)
        // this.stack.container.removeEventListener('dragleave', this.handleDragLeave)
        // this.stack.container.removeEventListener('drop', this.handleDrop)
    }

    handleStack = async () => {
        const stack = await this.getStack()
        if (stack.length === 0) {
            this.emptyState()
            this.handleDragRecipient()
        } else {
            this.handleDragSender()
            this.handleDragRecipient()
        }
    }

    resetStack = () => {
        this.resetDrag()

        while (this.stack.container.hasChildNodes()) {
            this.stack.container.removeChild(this.stack.container.firstChild)
        }

        this.stack.container.appendChild(this.stack.heading)
    }

    filterByProject = async (projectId) => {
        this.resetStack()

        try {
            const { data } = await fetchData(`/api/users/${this.user}/dones`)

            const filtered = data.filter((done) => {
                return done.project_id === parseInt(projectId)
            })

            if (filtered.length === 0) {
                this.emptyState()
                this.handleDragRecipient()
            } else {
                this.createStack(filtered)
                this.handleDragSender()
                this.handleDragRecipient()
            }

            return filtered
        } catch (err) {
            console.error(err)
        }
    }

    showEditModal = () => {
        this.edit.modal.classList.remove('hidden')
    }

    closeEditModal = () => {
        this.edit.modal.classList.add('hidden')
    }

    showDeleteModal = () => {
        this.delete.modal.classList.remove('hidden')
    }

    closeDeleteModal = () => {
        this.delete.modal.classList.add('hidden')
    }
}

export default Dones