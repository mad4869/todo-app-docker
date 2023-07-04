import { fetchData, sendData, updateData, deleteData } from "../components/data"
import {
    validate,
    showError,
    resetError,
    enableSubmit,
    validateSubmit
} from '../components/form'
import createButton from "../components/button"
import showNotice from "../components/notice"
import loadAnimation from "../components/animation"

class Projects {
    constructor(user) {
        this.user = user

        this.stack = {
            container: document.getElementById('projects-container'),
            counter: document.getElementById('projects-counter')
        }

        this.add = {
            modal: document.getElementById('modal-add-project'),
            form: {
                form: document.getElementById('form-add-project'),
                fields: {
                    title: document.getElementById('form-add-project-title'),
                    description: document.getElementById('form-add-project-description')
                },
                submit: document.getElementById('form-add-project-submit')
            },
            show: document.getElementById('modal-add-project-show-button'),
            close: document.getElementById('modal-add-project-close-button')
        }

        this.edit = {
            modal: document.getElementById('modal-edit-project'),
            form: {
                form: document.getElementById('form-edit-project'),
                fields: {
                    id: document.getElementById('form-edit-project-id'),
                    title: document.getElementById('form-edit-project-title'),
                    description: document.getElementById('form-edit-project-description')
                },
                submit: document.getElementById('form-edit-project-submit')
            },
            close: document.getElementById('modal-edit-project-close-button')
        }

        this.delete = {
            modal: document.getElementById('modal-delete-project'),
            deleted: document.getElementById('modal-delete-project-deleted'),
            confirm: document.getElementById('modal-delete-project-confirm'),
            cancel: document.getElementById('modal-delete-project-cancel'),
            close: document.getElementById('modal-delete-project-close-button')
        }

        this.todos = {
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
            close: document.getElementById('modal-add-todo-close-button')
        }

        this.loading = document.getElementById('projects-loading')
    }

    createHeading = () => {
        const heading = document.createElement('div')
        heading.className = 'flex justify-between items-center px-4 bg-indigo-700 text-white rounded-t-2xl group'

        return heading
    }

    createContent = (dataTitle, dataDescription) => {
        const content = document.createElement('div')
        content.className = 'flex-1 pr-4 py-2'

        const title = document.createElement('p')
        title.className = 'text-2xl font-semibold'
        title.textContent = dataTitle

        const description = document.createElement('p')
        description.textContent = dataDescription

        content.append(title, description)

        return content
    }

    createToolbar = (editButton, deleteButton, addButton) => {
        const toolbar = document.createElement('div')
        toolbar.className = 'flex gap-2'

        toolbar.append(editButton, deleteButton, addButton)
        return toolbar
    }

    createEmptyList = (projectId) => {
        const emptyList = document.createElement('li')
        emptyList.className = 'mx-auto'

        const handleAdd = () => {
            this.showTodosModal()

            this.todos.form.fields.project.value = projectId
        }

        const addButton = createButton('flex gap-2 items-center px-4 py-1 text-indigo-700 font-semibold border border-dashed border-indigo-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase', '<i class="fa-solid fa-circle-plus fa-sm text-indigo-700"></i><span>add your first task</span>', handleAdd, 'add-todo-button', 'Create your first task')

        emptyList.append(addButton)

        return emptyList
    }

    createList = (projectId, todos) => {
        const list = document.createElement('ul')
        list.className = 'h-full flex flex-col justify-center px-8 py-2'

        if (todos.length === 0) {
            const empty = this.createEmptyList(projectId)

            list.append(empty)

            return list
        }

        for (let i = 0; i < todos.length; i++) {
            const todo = document.createElement('li')
            todo.className = 'flex gap-4 justify-between items-center border-b border-solid border-slate-300'

            const title = document.createElement('h6')
            title.className = 'text-xs'
            title.textContent = todos[i].title

            const badge = document.createElement('div')
            todos[i].is_done === false ? badge.innerHTML = '<i class="fa-regular fa-hourglass fa-xs text-violet-700"></i>' : badge.innerHTML = '<i class="fa-solid fa-circle-check fa-xs text-teal-600"></i>'

            todo.append(title, badge)

            list.append(todo)
        }

        list.lastElementChild.classList.remove('border-b')

        return list
    }

    createCard = (dataId, dataTitle, dataDescription, dataTodos) => {
        const card = document.createElement('div')
        card.className = 'flex flex-col bg-white rounded-2xl border border-solid border-indigo-700'
        card.setAttribute('data-id', dataId)

        const handleEdit = async () => {
            this.showEditProject()

            const { data } = await fetchData(`/api/users/${this.user}/projects/${dataId}`)
            this.edit.form.fields.id.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description
        }


        const handleDelete = async () => {
            this.showDeleteProject()

            const { data } = await fetchData(`/api/users/${this.user}/projects/${dataId}`)
            this.delete.deleted.textContent = data.title

            this.delete.confirm.addEventListener('click', async () => {
                this.delete.confirm.innerHTML = ''
                loadAnimation(this.delete.confirm, 'dots-white')

                try {
                    const res = await deleteData(`/api/users/${this.user}/projects/${dataId}`)
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
                this.closeDeleteProject()
            })
        }

        const handleAdd = () => {
            this.showTodosModal()

            this.todos.form.fields.project.value = dataId
        }

        const editButton = createButton('invisible group-hover:visible hover:text-emerald-500', '<i class="fa-solid fa-pen-to-square fa-sm"></i>', handleEdit, 'edit-button', 'Edit this project')
        const deleteButton = createButton('invisible group-hover:visible hover:text-rose-500', '<i class="fa-solid fa-trash fa-sm"></i>', handleDelete, 'delete-button', 'Delete this project')
        const addButton = createButton('invisible group-hover:visible hover:text-violet-500', '<i class="fa-solid fa-circle-plus fa-sm">', handleAdd, 'add-todo-button', 'Add a new task')

        const content = this.createContent(dataTitle, dataDescription)
        const toolbar = this.createToolbar(editButton, deleteButton, addButton)
        const heading = this.createHeading()

        heading.append(content, toolbar)

        const todos = this.createList(dataId, dataTodos)

        card.append(heading, todos)

        return card
    }

    createStack = async (data) => {
        for (let i = 0; i < data.length; i++) {
            const todos = await fetchData(`/api/users/${this.user
                }/projects/${data[i].project_id
                }/todos`)

            const card = this.createCard(data[i].project_id, data[i].title, data[i].description, todos.data)

            this.stack.container.append(card)
        }
    }

    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user
                }/projects`)

            this.stack.counter.innerHTML = `You have <span class="text-teal-300 font-bold">${data.length
                } projects</span> so far`

            this.createStack(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    emptyState = () => {
        const emptyBox = document.createElement('div')
        emptyBox.className = 'col-span-1 flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-indigo-700 text-indigo-700 text-lg capitalize rounded-2xl sm:text-xl sm:col-span-2 sm:col-span-3'
        emptyBox.setAttribute('id', 'empty-state')

        const illustration = document.createElement('img')
        illustration.className = 'w-20'
        illustration.setAttribute('src', '/static/dist/img/empty-primary.svg')
        illustration.setAttribute('alt', 'This column is empty')

        const text = document.createElement('h3')
        text.textContent = "you haven't added any projects yet"

        const handleCta = () => {
            this.showAddModal()
        }

        const ctaButton = createButton('bg-indigo-700 mt-8 px-4 py-1 text-white font-semibold rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase', 'get started', handleCta, 'project-cta-button', 'Create your first project')

        emptyBox.append(illustration, text, ctaButton)

        this.stack.container.append(emptyBox)
    }

    handleStack = async () => {
        loadAnimation(this.loading, 'loading')

        try {
            const stack = await this.getStack()
            if (stack) {
                this.loading.classList.add('hidden')
    
                if (stack.length === 0) {
                    this.emptyState()
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    showTodosModal = () => {
        this.todos.modal.classList.remove('hidden')
    }

    closeTodosModal = () => {
        this.todos.modal.classList.add('hidden')
    }

    handleCloseTodosModal = () => {
        this.todos.close.addEventListener('click', () => {
            this.closeTodosModal()
        })
    }

    showAddModal = () => {
        this.add.modal.classList.remove('hidden')
    }

    handleShowAddModal = () => {
        this.add.show.addEventListener('click', () => {
            this.showAddModal()
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

    showEditProject = () => {
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

    showDeleteProject = () => {
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
            if (this.todos.modal) {
                const addTodoButtons = document.querySelectorAll('button[name="add-todo-button"]')
                const addTodoClicked = this.todos.modal.firstElementChild.contains(e.target) || Array.from(addTodoButtons).some((button) => button.contains(e.target))
                if (!addTodoClicked) {
                    this.closeTodosModal()
                }
            }

            if (this.add.modal) {
                const ctaButton = document.querySelector('button[name="project-cta-button"]')
                let addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target)
                if (ctaButton) {
                    addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target) || ctaButton.contains(e.target)
                }
                if (!addProjectClicked) {
                    this.closeAddModal()
                }
            }

            if (this.edit.modal) {
                const editButtons = document.querySelectorAll('button[name="edit-button"]')
                const editProjectClicked = this.edit.modal.firstElementChild.contains(e.target) || Array.from(editButtons).some((button) => button.contains(e.target))
                if (!editProjectClicked) {
                    this.closeEditModal()
                }
            }

            if (this.delete.modal) {
                const deleteButtons = document.querySelectorAll('button[name="delete-button"]')
                const deleteProjectClicked = this.delete.modal.firstElementChild.contains(e.target) || Array.from(deleteButtons).some((button) => button.contains(e.target))
                if (!deleteProjectClicked) {
                    this.closeDeleteModal()
                }
            }
        })
    }

    handleModal = () => {
        this.handleShowAddModal()
        this.handleCloseAddModal()
        this.handleCloseEditModal()
        this.handleCloseDeleteModal()
        this.handleCloseTodosModal()
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
            loadAnimation(submitButton, 'dots-white')

            const formData = new FormData(form)
            try {
                const res = formData.get('_method') !== 'PUT' ?
                    await validateSubmit(formData, apiUrl, method) :
                    await validateSubmit(formData, apiUrl + formData.get('project_id'), method)
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
        this.handleInput(this.todos.form.fields, this.todos.form.submit)
        this.handleBlur(this.add.form.fields)
        this.handleBlur(this.edit.form.fields)
        this.handleBlur(this.todos.form.fields)
        this.handleFocus(this.add.form.fields)
        this.handleFocus(this.edit.form.fields)
        this.handleFocus(this.todos.form.fields)
        this.handleSubmit(this.add.form.form, `/api/users/${this.user}/projects`, sendData, this.add.form.submit, this.closeAddModal)
        this.handleSubmit(this.edit.form.form, `/api/users/${this.user}/projects/`, updateData, this.edit.form.submit, this.closeEditModal)
        this.handleSubmit(this.todos.form.form, `/api/users/${this.user}/todos`, sendData, this.todos.form.submit, this.closeTodosModal)
    }
}

export default Projects
