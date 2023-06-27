import Menu from './menu'

import { fetchData, sendData, updateData, deleteData } from '../components/data'
import { validate, showError, resetError, enableSubmit } from '../components/form'
import createButton from '../components/button'
import createSeparator from "../components/separator"
import showNotice from "../components/notice"

class Todos {
    constructor(user) {
        this.user = user

        this.stack = {
            container: document.getElementById('home-todos-container'),
            heading: document.getElementById('home-todos-heading')
        }

        this.add = {
            modal: document.getElementById('modal-add-todo'),
            form: {
                form: document.getElementById('form-add-todo'),
                fields: {
                    project: document.getElementById('form-add-todo-project'),
                    title: document.getElementById('form-add-todo-title'),
                    description: document.getElementById('form-add-todo-description')
                },
                submit: document.getElementById('form-add-todo-submit')
            },
            show: document.getElementById('modal-add-todo-show-button'),
            close: document.getElementById('modal-add-todo-close-button')
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
        // Click events
        this.add.show.addEventListener('click', () => {
            this.showAddModal()

            const menu = new Menu()
            menu.closeMenu()
        })
        this.add.close.addEventListener('click', () => {
            this.closeAddModal()
        })
        this.edit.close.addEventListener('click', () => {
            this.closeEditModal()
        })
        this.delete.close.addEventListener('click', () => {
            this.closeDeleteModal()
        })

        // Form events
        this.validateInput(this.add.form.fields, this.add.form.submit)
        this.validateInput(this.edit.form.fields, this.edit.form.submit)
        this.validateBlur(this.add.form.fields)
        this.validateBlur(this.edit.form.fields)
        this.resetFocus(this.add.form.fields)
        this.resetFocus(this.edit.form.fields)
        this.validateSubmit(this.add.form.form)
        this.validateSubmit(this.edit.form.form)

        // Drag and drop events
        this.stack.container.addEventListener('dragenter', (e) => {
            e.preventDefault()
            this.stack.container.classList.add('bg-fuchsia-400')
        })
        this.stack.container.addEventListener('dragover', (e) => {
            e.preventDefault()
            this.stack.container.classList.add('bg-fuchsia-400')
        })
        this.stack.container.addEventListener('dragleave', (e) => {
            e.preventDefault()
            this.stack.container.classList.remove('bg-fuchsia-400')
        })
    }

    createHeading = (todoTitle, project) => {
        const heading = document.createElement('div')
        heading.className = 'flex justify-between items-center bg-violet-700 px-4 py-2'

        const title = document.createElement('h1')
        title.className = 'flex-1 text-xl text-white font-semibold'
        title.textContent = todoTitle

        const label = document.createElement('span')
        label.className = 'px-2 py-1 border border-solid border-white text-white text-sm rounded-full'
        label.textContent = project

        heading.append(title, label)

        return heading
    }

    createDescription = (todoDesc) => {
        const description = document.createElement('div')
        description.className = 'bg-white px-4 py-2 text-xs'
        description.textContent = todoDesc

        return description
    }

    createToolbar = (editButton, deleteButton, doneButton) => {
        const toolbar = document.createElement('div')
        toolbar.className = 'flex justify-between bg-white px-4'

        const leftButtons = document.createElement('span')
        const rightButtons = document.createElement('span')

        leftButtons.append(editButton, deleteButton)
        rightButtons.append(doneButton)

        toolbar.append(leftButtons, rightButtons)

        return toolbar
    }

    createCard = (todoId, todoTitle, project, todoDesc) => {
        const card = document.createElement('div')
        card.className = 'w-full pb-2 bg-white border border-solid border-slate-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'
        card.setAttribute('draggable', true)
        card.setAttribute('data-id', todoId)

        const handleEdit = async () => {
            this.showEditModal()

            const { data } = await fetchData(`/api/users/${this.user}/todos/${todoId}`)
            this.edit.form.fields.id.value = data.todo_id
            this.edit.form.fields.project.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description
        }

        const handleDelete = async () => {
            this.showDeleteModal()

            const { data } = await fetchData(`/api/users/${this.user}/todos/${todoId}`)
            this.delete.deleted.textContent = data.title

            this.delete.confirm.addEventListener('click', () => {
                this.closeDeleteModal()
                this.deleteTodo(todoId)
            })

            this.delete.cancel.addEventListener('click', () => {
                this.closeDeleteModal()
            })
        }

        const handleDone = () => {
            this.markAsDone(todoId)
        }

        const editButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-emerald-700', 'Edit', handleEdit, 'edit-button', 'Edit this task')
        const deleteButton = createButton('ml-1 px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-rose-700', 'Delete', handleDelete, 'delete-button', 'Delete this task')
        const doneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-violet-700', '<i class="fa-solid fa-check"></i>', handleDone, 'done-button', 'Mark as done')

        const heading = this.createHeading(todoTitle, project)
        const description = this.createDescription(todoDesc)
        const toolbar = this.createToolbar(editButton, deleteButton, doneButton)

        card.append(heading, description, toolbar)

        return card
    }

    createStack = (data) => {
        for (let i = 0; i < data.length; i++) {
            const id = data[i].todo_id
            const title = data[i].title
            const project = data[i].project_title
            const description = data[i].description

            const card = this.createCard(id, title, project, description)

            const separator = createSeparator('bg-violet-200')

            this.stack.container.append(separator, card)
        }
    }

    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos/`)

            this.createStack(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    deleteTodo = async (todoId) => {
        try {
            const { success } = await deleteData(`/api/users/${this.user}/todos/${todoId}`);
            if (success) {
                location.reload()
                // showNotice('Your task has been deleted!', 'error', alertAnimation)
            }
        } catch (err) {
            console.error(err);
        }
    }

    markAsDone = async (todo_id) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos/${todo_id}`)
            const updatedData = {
                ...data,
                is_done: true,
            }

            const { success } = await updateData(`/api/users/${this.user}/todos/${todo_id}`, JSON.stringify(updatedData))
            if (success) {
                location.reload()
                // showNotice('Congratulation, you have finished your task!', 'success', successAnimation)
            }
        } catch (err) {
            console.error(err)
        }
    }

    dragAsDone = async (todoId) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos/${todoId}`)
            const updatedData = {
                ...data,
                is_done: true,
            }

            const { success } = await updateData(`/api/users/${this.user}/todos/${todoId}`, JSON.stringify(updatedData))
            if (success) {
                showNotice('Congratulation, you have finished your task!', 'success')
            }
        } catch (err) {
            console.error(err)
        }
    }

    filterByProjects = async (projectId) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos`)

            while (this.stack.container.hasChildNodes()) {
                this.stack.container.removeChild(this.stack.container.firstChild)
            }

            this.stack.container.appendChild(this.stack.heading)

            const filtered = data.filter((todo) => {
                return todo.project_id === parseInt(projectId)
            })

            this.createStack(filtered)
        } catch (err) {
            console.error(err)
        }
    }

    showAddModal = () => {
        this.add.modal.classList.remove('hidden')
    }

    closeAddModal = () => {
        this.add.modal.classList.add('hidden')
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

    emptyState = () => {
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-violet-700 text-violet-700 text-xl capitalize rounded-2xl'

        const illustration = document.createElement('img')
        illustration.className = 'w-20'
        illustration.setAttribute('src', '/static/dist/img/empty-primary.svg')
        illustration.setAttribute('alt', 'This column is empty')

        const text = document.createElement('h3')
        text.textContent = "you haven't added any tasks yet"

        const handleCta = () => {
            this.showAddModal()
        }

        const ctaButton = createButton('bg-violet-700 mt-8 px-4 py-1 text-white font-semibold rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase', 'get started', handleCta, 'todo-cta-button', 'Create your first task')

        emptyBox.append(illustration, text, ctaButton)

        const separator = createSeparator('bg-violet-200')

        this.stack.container.append(separator, emptyBox)
    }

    validateBlur = (fields) => {
        for (const field in fields) {
            fields[field].addEventListener('blur', () => {
                let isValid = validate(fields[field])

                if (!isValid) {
                    showError(fields[field])
                }
            })
        }
    }

    resetFocus = (fields) => {
        for (const field in fields) {
            fields[field].addEventListener('focus', () => {
                resetError(fields[field])
            })
        }
    }

    validateInput = (fields, submit) => {
        for (const field in fields) {
            fields[field].addEventListener('input', () => {
                enableSubmit(fields, submit)
            })
        }
    }

    validateSubmit = (form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(form)

            const method = formData.get('_method')
            method === 'PUT' ?
                this.closeEditModal() :
                this.closeAddModal()

            try {
                const res = method === 'PUT' ?
                    await updateData(`/api/users/${this.user}/todos/${formData.get('todo_id')}`, formData) :
                    await sendData(`/api/users/${this.user}/todos`, formData)
                if (res.success) {
                    location.reload()
                    // showNotice(`Your task has been ${method === 'PUT' ? 'updated' : 'added'}`, 'success', successAnimation)
                } else {
                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default Todos