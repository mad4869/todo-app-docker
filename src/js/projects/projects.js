import { createProjectCard } from "../components/card"
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

    async getStack(user_id) {
        try {
            const projectsData = await this.getProjectsData(user_id)

            this.counter.innerHTML = `You have <span class="text-teal-300 font-bold">${projectsData.length} projects</span> so far`

            for (let i = 0; i < projectsData.length; i++) {
                const todosData = await this.getTodosData(user_id, projectsData[i].project_id)

                const card = createProjectCard(projectsData[i].project_id, projectsData[i].title, projectsData[i].description, todosData)

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