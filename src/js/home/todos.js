import Menu from './menu'
import Dones from './dones'

import { fetchData, sendData, updateData, deleteData } from '../components/data'
import { validate, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import createButton from '../components/button'
import showNotice from "../components/notice"
import loadAnimation from '../components/animation'
import { doneToTodo } from '../components/switch'

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

        this.draggedContainer = null
    }

    createHeading = (todoTitle, project) => {
        const heading = document.createElement('div')
        heading.className = 'flex justify-between items-center bg-violet-700 px-4 py-2 text-white'

        const title = document.createElement('h1')
        title.className = 'flex-1 text-xl font-semibold'
        title.textContent = todoTitle

        const label = document.createElement('span')
        label.className = 'px-2 py-1 border border-solid border-white text-sm rounded-full'
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

            const { data } = await fetchData(`/api/users/${this.user
                }/todos/${todoId}`)
            this.edit.form.fields.id.value = data.todo_id
            this.edit.form.fields.project.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description
        }

        const handleDelete = async () => {
            this.showDeleteModal()

            const { data } = await fetchData(`/api/users/${this.user
                }/todos/${todoId}`)
            this.delete.deleted.textContent = data.title

            this.delete.confirm.addEventListener('click', () => {
                this.closeDeleteModal()
                this.deleteTodo(todoId)
            })

            this.delete.cancel.addEventListener('click', () => {
                this.closeDeleteModal()
            })
        }

        this.handleDone = () => {
            this.markAsDone(todoId)
        }

        const editButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-emerald-700', 'Edit', handleEdit, 'edit-button', 'Edit this task')
        const deleteButton = createButton('ml-1 px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-rose-700', 'Delete', handleDelete, 'delete-button', 'Delete this task')
        const doneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-violet-700', '<i class="fa-solid fa-check"></i>', this.handleDone, 'done-button', 'Mark as done')

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

            this.stack.container.append(card)
        }
    }

    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user
                }/todos/`)

            this.createStack(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    emptyState = () => {
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-violet-700 text-violet-700 text-xl capitalize rounded-2xl'
        emptyBox.setAttribute('id', 'empty-state')

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

        this.stack.container.append(emptyBox)
    }

    deleteTodo = async (todoId) => {
        try {
            const { success } = await deleteData(`/api/users/${this.user}/todos/${todoId}`);
            if (success) {
                location.reload()
            }
        } catch (err) {
            console.error(err);
        }
    }

    markAsDone = async (todo_id) => {
        try {
            const { data } = await fetchData(`/api/users/${this.user
                }/todos/${todo_id}`)
            const updatedData = {
                ...data,
                is_done: true
            }

            const { success } = await updateData(`/api/users/${this.user
                }/todos/${todo_id}`, JSON.stringify(updatedData))
            if (success) {
                location.reload()
            }
        } catch (err) {
            console.error(err)
        }
    }

    handleDragSender = () => {
        this.handleDragStart = (e) => {
            this.draggedContainer = e.target.parentNode

            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'))

            setTimeout(() => {
                e.target.classList.add('hidden');
                e.target.previousElementSibling.classList.add('hidden')
            }, 0);
        }

        this.handleDragEnd = (e) => {
            e.target.classList.remove('hidden')
            e.target.previousElementSibling.classList.remove('hidden')
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
            this.stack.container.classList.add('bg-fuchsia-400')
        }

        this.handleDragLeave = (e) => {
            e.preventDefault()
            this.stack.container.classList.remove('bg-fuchsia-400')
        }

        this.handleDrop = (e) => {
            e.preventDefault()
            this.stack.container.classList.remove('bg-fuchsia-400')

            if (this.draggedContainer === this.stack.container) {
                return
            }

            const empty = document.getElementById('empty-state')
            if (empty) {
                empty.classList.add('hidden')
            }

            const data = e.dataTransfer.getData('text/plain')

            const dropped = document.querySelector(`[data-id="${data}"]`)
            const doneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)] bg-violet-700', '<i class="fa-solid fa-check"></i>', this.handleDone, 'done-button', 'Mark as done')

            doneToTodo(dropped, doneButton)

            this.stack.container.append(dropped)

            const dones = new Dones(this.user)
            // dones.markAsUndone(data)
        }

        this.stack.container.addEventListener('dragenter', this.handleDragEnterOver)
        this.stack.container.addEventListener('dragover', this.handleDragEnterOver)
        this.stack.container.addEventListener('dragleave', this.handleDragLeave)
        this.stack.container.addEventListener('drop', this.handleDrop)
    }

    resetDrag = () => {
        const allTasks = document.querySelectorAll('div[draggable="true"]')
        allTasks.forEach((task) => {
            task.removeEventListener('dragstart', this.handleDragStart)
            task.removeEventListener('dragend', this.handleDragEnd)
        })

        this.stack.container.removeEventListener('dragenter', this.handleDragEnterOver)
        this.stack.container.removeEventListener('dragover', this.handleDragEnterOver)
        this.stack.container.removeEventListener('dragleave', this.handleDragLeave)
        this.stack.container.removeEventListener('drop', this.handleDrop)
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
        while (this.stack.container.hasChildNodes()) {
            this.stack.container.removeChild(this.stack.container.firstChild)
        }

        this.stack.container.appendChild(this.stack.heading)
    }

    filterByProjects = async (projectId) => {
        try {
            this.resetStack()

            const { data } = await fetchData(`/api/users/${this.user
                }/todos`)

            const filtered = data.filter((todo) => {
                return todo.project_id === parseInt(projectId)
            })

            if (filtered.length === 0) {
                this.emptyState()
                this.resetDrag()
                this.handleDragRecipient()
            } else {
                this.createStack(filtered)
                this.resetDrag()
                this.handleDragSender()
                this.handleDragRecipient()
            }

            return filtered
        } catch (err) {
            console.error(err)
        }
    }

    showAddModal = () => {
        this.add.modal.classList.remove('hidden')
    }

    handleShowAddModal = () => {
        this.add.show.addEventListener('click', () => {
            this.showAddModal()

            const menu = new Menu()
            menu.closeMenu()
        })
    }

    closeAddModal = () => {
        this.add.modal.classList.add('hidden')
    }

    handleCloseAddModal = () => {
        this.add.close.addEventListener('click', () => {
            this.closeAddModal()
        })
    }

    showEditModal = () => {
        this.edit.modal.classList.remove('hidden')
    }

    closeEditModal = () => {
        this.edit.modal.classList.add('hidden')
    }

    handleCloseEditModal = () => {
        this.edit.close.addEventListener('click', () => {
            this.closeEditModal()
        })
    }

    showDeleteModal = () => {
        this.delete.modal.classList.remove('hidden')
    }

    closeDeleteModal = () => {
        this.delete.modal.classList.add('hidden')
    }

    handleCloseDeleteModal = () => {
        this.delete.close.addEventListener('click', () => {
            this.closeDeleteModal()
        })
    }

    handleClickOutsideModal = () => {
        document.addEventListener('click', (e) => {
            if (this.add.modal) {
                const ctaButton = document.querySelector('button[name="todo-cta-button"]')
                let addTodoClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target)
                if (ctaButton) {
                    addTodoClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target) || ctaButton.contains(e.target)
                }
                if (!addTodoClicked) {
                    this.closeAddModal()
                }
            }

            if (this.edit.modal) {
                const editButtons = document.querySelectorAll('button[name="edit-button"]')
                const editTodoClicked = this.edit.modal.firstElementChild.contains(e.target) || Array.from(editButtons).some((button) => button.contains(e.target))
                if (!editTodoClicked) {
                    this.closeEditModal()
                }
            }

            if (this.delete.modal) {
                const deleteButtons = document.querySelectorAll('button[name="delete-button"]')
                const deleteTodoClicked = this.delete.modal.firstElementChild.contains(e.target) || Array.from(deleteButtons).some((button) => button.contains(e.target))
                if (!deleteTodoClicked) {
                    this.closeDeleteModal()
                }
            }
        });
    }

    handleModal = () => {
        this.handleShowAddModal()
        this.handleCloseAddModal()
        this.handleCloseEditModal()
        this.handleCloseDeleteModal()
        this.handleClickOutsideModal()
    }

    handleBlur = (fields) => {
        for (const field in fields) {
            fields[field].addEventListener('blur', () => {
                let isValid = validate(fields[field])

                if (!isValid) {
                    showError(fields[field])
                }
            })
        }
    }

    handleFocus = (fields) => {
        for (const field in fields) {
            fields[field].addEventListener('focus', () => {
                resetError(fields[field])
            })
        }
    }

    handleInput = (fields, submit) => {
        for (const field in fields) {
            fields[field].addEventListener('input', () => {
                enableSubmit(fields, submit)
            })
        }
    }

    handleSubmit = (form, apiUrl, method, submitButton, modalCloser) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const defaultMsg = submitButton.innerHTML
            submitButton.innerHTML = ''
            loadAnimation(submitButton, 'dots')

            const formData = new FormData(form)

            try {
                const res = formData.get('_method') !== 'PUT' ?
                    await validateSubmit(formData, apiUrl, method) :
                    await validateSubmit(formData, apiUrl + formData.get('todo_id'), method)
                if (res.success) {
                    location.reload()
                } else {
                    submitButton.innerHTML = defaultMsg
                    modalCloser()

                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    handleForm = () => {
        this.handleInput(this.add.form.fields, this.add.form.submit)
        this.handleInput(this.edit.form.fields, this.edit.form.submit)
        this.handleBlur(this.add.form.fields)
        this.handleBlur(this.edit.form.fields)
        this.handleFocus(this.add.form.fields)
        this.handleFocus(this.edit.form.fields)
        this.handleSubmit(this.add.form.form, `/api/users/${this.user}/todos`, sendData, this.add.form.submit, this.closeAddModal)
        this.handleSubmit(this.edit.form.form, `api/users/${this.user}/todos/`, updateData, this.edit.form.submit, this.closeEditModal)
    }
}

export default Todos
