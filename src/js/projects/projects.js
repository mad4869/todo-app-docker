import fetchData, { deleteData } from "../components/data"

class Projects {
    constructor() {
        this.container = document.getElementById('projects-container')
        this.counter = document.getElementById('projects-counter')

        this.addTodoModal = document.getElementById('modal-add-todo')
        this.addTodoCloseButton = document.getElementById('modal-add-todo-close-button')

        this.addProjectModal = document.getElementById('modal-add-project')
        this.addProjectShowButton = document.getElementById('modal-add-project-show-button')
        this.addProjectCloseButton = document.getElementById('modal-add-project-close-button')

        this.editProjectModal = document.getElementById('modal-edit-project')
        this.editProjectCloseButtons = document.getElementById('modal-edit-project-close-button')

        this.deleteProjectModal = document.getElementById('modal-delete-project')
        this.deleteProjectDeleted = document.getElementById('modal-delete-project-deleted')
        this.deleteProjectConfirm = document.getElementById('modal-delete-project-confirm')
        this.deleteProjectCancel = document.getElementById('modal-delete-project-cancel')
        this.deleteProjectCloseButtons = document.getElementById('modal-delete-project-close-button')
    }

    async getProjectsData(user_id) {
        return await fetchData(`/api/users/${user_id}/projects`)
    }

    async getTodosData(user_id, project_id) {
        return await fetchData(`/api/users/${user_id}/projects/${project_id}/todos`)
    }

    async deleteProject(project_id) {
        try {
            const data = await deleteData(`/api/projects/${project_id}`);
            if (data) {
                location.reload()
            }
        } catch (err) {
            console.error(err);
        }
    }

    async createTodosList(user_id, project_id) {
        const data = await this.getTodosData(user_id, project_id)

        const list = document.createElement('ul')
        list.className = 'h-full flex flex-col justify-center pl-4 pr-8'

        const empty = document.createElement('li')
        empty.className = 'mx-auto'

        const button = document.createElement('button')
        button.className = 'flex gap-2 items-center px-4 py-1 text-indigo-700 font-semibold border border-dashed border-indigo-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase'
        button.innerHTML = '<i class="fa-solid fa-circle-plus fa-sm text-indigo-700"></i><span>add your first task</span>'
        button.addEventListener('click', () => {
            this.showAddTodo()

            document.getElementById('form-add-todo-project').value = project_id
        })

        empty.append(button)

        if (data.length === 0) {
            list.append(empty)
            return list
        }

        for (let i = 0; i < data.length; i++) {
            const todo = document.createElement('li')
            todo.className = 'flex justify-between items-center border-b border-solid border-slate-300'

            const title = document.createElement('h6')
            title.className = 'text-xs'
            title.textContent = data[i].title

            const badge = document.createElement('div')
            data[i].is_done === false ?
                badge.innerHTML = '<i class="fa-regular fa-hourglass fa-xs text-violet-700"></i>' :
                badge.innerHTML = '<i class="fa-solid fa-circle-check fa-xs text-teal-600"></i>'

            todo.append(title, badge)

            list.append(todo)
        }

        list.lastElementChild.classList.remove('border-b')

        return list
    }

    async getList(user_id) {
        try {
            const projectsData = await this.getProjectsData(user_id)

            this.counter.innerHTML = `You have <span class="text-teal-300 font-bold">${projectsData.length} projects</span> so far`

            for (let i = 0; i < projectsData.length; i++) {
                const card = document.createElement('div')
                card.className = 'flex flex-col bg-white rounded-2xl border border-solid border-indigo-700'
                card.setAttribute('data-id', projectsData[i].project_id)

                const heading = document.createElement('div')
                heading.className = 'flex justify-between items-center px-4 bg-indigo-700 text-white rounded-t-2xl group'

                const content = document.createElement('div')
                content.className = 'flex-1 pr-4 py-2'

                const title = document.createElement('p')
                title.className = 'text-2xl font-semibold'
                title.textContent = projectsData[i].title

                const description = document.createElement('p')
                description.textContent = projectsData[i].description

                content.append(title, description)

                const todos = await this.createTodosList(user_id, projectsData[i].project_id)

                const buttons = document.createElement('div')
                buttons.className = 'flex gap-2'

                const editButton = document.createElement('button')
                editButton.className = 'invisible group-hover:visible hover:text-emerald-500'
                editButton.setAttribute('title', 'Edit this project')
                editButton.innerHTML = '<i class="fa-solid fa-pen-to-square fa-sm"></i>'
                editButton.addEventListener('click', async () => {
                    this.showEditProject()

                    const data = await fetchData(`/api/projects/${projectsData[i].project_id}`)
                    document.getElementById('form-edit-project-id').value = data.project_id
                    document.getElementById('form-edit-project-title').value = data.title
                    document.getElementById('form-edit-project-description').value = data.description
                })

                const deleteButton = document.createElement('button')
                deleteButton.className = 'invisible group-hover:visible hover:text-rose-500'
                deleteButton.setAttribute('title', 'Delete this project')
                deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-sm"></i>'
                deleteButton.addEventListener('click', async () => {
                    this.showDeleteProject()

                    const data = await fetchData(`/api/projects/${projectsData[i].project_id}`)
                    this.deleteProjectDeleted.textContent = data.title

                    // Bind event listener to the confirm button to execute the deletion process
                    this.deleteProjectConfirm.addEventListener('click', function () {
                        this.deleteProject(projectsData[i].project_id)
                    })

                    // Bind event listener to the cancel button to close the delete modal
                    this.deleteProjectCancel.addEventListener('click', function () {
                        this.closeDeleteProject()
                    })
                })

                const addButton = document.createElement('button')
                addButton.className = 'invisible group-hover:visible hover:text-violet-500'
                addButton.setAttribute('title', 'Add a new task')
                addButton.innerHTML = '<i class="fa-solid fa-circle-plus fa-sm">'
                addButton.addEventListener('click', async () => {
                    this.showAddTodo()

                    document.getElementById('form-add-todo-project').value = projectsData[i].project_id
                })

                buttons.append(editButton, deleteButton, addButton)

                heading.append(content, buttons)


                card.append(heading, todos)

                this.container.append(card)
            }
        } catch (err) {
            console.error(err)
        }
    }

    showAddTodo() {
        this.addTodoModal.classList.remove('hidden')
    }

    closeAddTodo() {
        this.addTodoModal.classList.add('hidden')
    }

    showAddProject() {
        this.addProjectModal.classList.remove('hidden')
    }

    closeAddProject() {
        this.addProjectModal.classList.add('hidden')
    }

    showEditProject() {
        this.editProjectModal.classList.remove('hidden')
    }

    closeEditProject() {
        this.editProjectModal.classList.add('hidden')
    }

    showDeleteProject() {
        this.deleteProjectModal.classList.remove('hidden')
    }

    closeDeleteProject() {
        this.deleteProjectModal.classList.add('hidden')
    }
}

export default Projects