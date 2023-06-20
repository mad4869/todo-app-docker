import Menu from "./menu"
import createEmptyState from '../components/empty'
import fetchData from "../components/data"
class Projects {
    constructor() {
        this.name = 'projects'

        this.dropdown = document.getElementById('home-projects-dropdown')
        this.optionsContainer = document.getElementById('home-projects-options-container')

        this.selected = document.getElementById('home-project-selected')
        // this.isProjectOptionsVisible = false;
        this.addProject = document.getElementById('modal-add-project')
        this.addProjectShowButton = document.getElementById('modal-add-project-show-button')
        this.addProjectCloseButton = document.getElementById('modal-add-project-close-button')
    }

    async getData(user_id) {
        return await fetchData(`/api/users/${user_id}/projects`)
    }

    async getOptions(user_id) {
        try {
            const data = await this.getData(user_id)

            for (let i = 0; i < data.length; i++) {
                const options = document.createElement('li')
                options.className = "w-full text-center border-b border-solid border-violet-500 py-2 cursor-pointer hover:bg-teal-600"
                options.textContent = JSON.stringify(data[i].title).split('"').join('')
                options.setAttribute('data-value', data[i].project_id)

                this.optionsContainer.appendChild(options)
            }

            const topOption = this.optionsContainer.firstElementChild
            topOption.classList.add('hover:rounded-t-2xl')
            const bottomOption = this.optionsContainer.lastElementChild
            bottomOption.classList.add('hover:rounded-b-2xl')
            bottomOption.classList.remove('border-b')

            return this.optionsContainer.childNodes
        } catch (err) {
            console.error(err)
        }
    }

    showOptions() {
        this.optionsContainer.classList.toggle('hidden')
        this.optionsContainer.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    closeOptions() {
        this.optionsContainer.classList.add('hidden')
    }

    showAddProject() {
        this.addProject.classList.remove('hidden')

        const menu = new Menu()
        menu.closeMenu()
    }

    closeAddProject() {
        this.addProject.classList.add('hidden')
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)

        this.optionsContainer.appendChild(emptyBox)

        return emptyBox
    }
}

export default Projects

