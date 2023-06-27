import { fetchData, deleteData } from "../components/data"
import createButton from "../components/button"

class Projects {
    constructor(user) {
        this.user = user

        this.stack = {
            container: document.getElementById('projects-container'),
            counter: document.getElementById('projects-counter')
        }

        this.add = {
            modal: document.getElementById('modal-add-project'),
            show: document.getElementById('modal-add-project-show-button'),
            close: document.getElementById('modal-add-project-close-button')
        }

        this.edit = {
            modal: document.getElementById('modal-edit-project'),
            form: {
                form: document,
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
                form: document,
                fields: {
                    project: document.getElementById('form-add-todo-project')
                },
                submit: document
            },
            close: document.getElementById('modal-add-todo-close-button')
        }
    }

    attachEventListeners = () => {
        this.add.show.addEventListener('click', () => {
            this.showAddProject()
        })

        this.add.close.addEventListener('click', () => {
            this.closeAddProject()
        })

        this.edit.close.addEventListener('click', () => {
            this.closeEditProject()
        })

        this.delete.close.addEventListener('click', () => {
            this.closeDeleteProject()
        })

        this.todos.close.addEventListener('click', () => {
            this.closeAddTodo()
        })
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

        const handleCta = () => {
            this.showAddTodo()

            this.todos.form.fields.project.value = projectId
        }

        const button = createButton(
            'flex gap-2 items-center px-4 py-1 text-indigo-700 font-semibold border border-dashed border-indigo-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase',
            '<i class="fa-solid fa-circle-plus fa-sm text-indigo-700"></i><span>add your first task</span>',
            handleCta,
            'cta-button',
            'Create your first task'
        )

        emptyList.append(button)

        return emptyList
    }

    createList = (projectId, todos) => {
        const list = document.createElement('ul')
        list.className = 'h-full flex flex-col justify-center pl-4 pr-8 py-2'

        if (todos.length === 0) {
            const empty = this.createEmptyList(projectId)

            list.append(empty)

            return list
        }

        for (let i = 0; i < todos.length; i++) {
            const todo = document.createElement('li')
            todo.className = 'flex justify-between items-center border-b border-solid border-slate-300'

            const title = document.createElement('h6')
            title.className = 'text-xs'
            title.textContent = todos[i].title

            const badge = document.createElement('div')
            todos[i].is_done === false ?
                badge.innerHTML = '<i class="fa-regular fa-hourglass fa-xs text-violet-700"></i>' :
                badge.innerHTML = '<i class="fa-solid fa-circle-check fa-xs text-teal-600"></i>'

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

            this.delete.confirm.addEventListener('click', () => {
                this.deleteProject(dataId)
                this.closeDeleteProject()
            })

            this.delete.cancel.addEventListener('click', () => {
                this.closeDeleteProject()
            })
        }

        const handleAdd = () => {
            this.showAddTodo()

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
            const todos = await fetchData(`/api/users/${this.user}/projects/${data[i].project_id}/todos`)

            const card = this.createCard(data[i].project_id, data[i].title, data[i].description, todos.data)

            this.stack.container.append(card)
        }
    }

    deleteProject = async (projectId) => {
        try {
            const { success } = await deleteData(`/api/projects/${projectId}`);
            if (success) {
                location.reload()
            }
        } catch (err) {
            console.error(err);
        }
    }

    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/projects`)

            this.stack.counter.innerHTML = `You have <span class="text-teal-300 font-bold">${data.length} projects</span> so far`

            this.createStack(data)
        } catch (err) {
            console.error(err)
        }
    }

    showAddTodo() {
        this.todos.modal.classList.remove('hidden')
    }

    closeAddTodo() {
        this.todos.modal.classList.add('hidden')
    }

    showAddProject() {
        this.add.modal.classList.remove('hidden')
    }

    closeAddProject() {
        this.add.modal.classList.add('hidden')
    }

    showEditProject() {
        this.edit.modal.classList.remove('hidden')
    }

    closeEditProject() {
        this.edit.modal.classList.add('hidden')
    }

    showDeleteProject() {
        this.delete.modal.classList.remove('hidden')
    }

    closeDeleteProject() {
        this.delete.modal.classList.add('hidden')
    }
}

export default Projects