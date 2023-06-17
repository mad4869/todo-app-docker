import Menu from "./menu"
import Todos from "./todos"
import makeCard from '../components/card'
class Projects {
    constructor() {
        this.dropdown = document.getElementById('home-projects-dropdown')
        this.optionsContainer = document.getElementById('home-projects-options-container')

        this.selected = document.getElementById('home-project-selected')
        // this.isProjectOptionsVisible = false;
        this.addProject = document.getElementById('modal-add-project')
        this.addProjectShowButton = document.getElementById('modal-add-project-show-button')
        this.addProjectCloseButton = document.getElementById('modal-add-project-close-button')
    }

    getData(user_id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText)
                    resolve(res)
                } else {
                    reject(new Error('Failed to fetch data'))
                }
            }

            xhr.open('GET', `/api/users/${user_id}/projects`, true)
            xhr.send()
        })
    }

    async getOptions(user_id) {
        try {
            const data = await this.getData(user_id)


            for (let i = 0; i < data.length; i++) {
                const options = document.createElement('li')
                options.className = "w-full text-center border-b border-solid border-violet-500 py-2 hover:bg-teal-600"
                options.textContent = JSON.stringify(data[i].title).split('"').join('')
                options.setAttribute('data-value', data[i].project_id)

                this.optionsContainer.appendChild(options)
            }

            const topOption = this.optionsContainer.firstElementChild
            topOption.classList.add('hover:rounded-t-2xl')
            const bottomOption = this.optionsContainer.lastElementChild
            bottomOption.classList.add('hover:rounded-b-2xl')
            bottomOption.classList.remove('border-b')

            return this.optionsContainer.children
        } catch (err) {
            console.error(err)
        }
    }

    showOptions() {
        this.optionsContainer.classList.remove('invisible')
        this.optionsContainer.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    closeOptions() {
        this.optionsContainer.classList.add('invisible')
    }

    showAddProject() {
        this.addProject.show()

        const menu = new Menu()
        menu.closeMenu()
    }

    closeAddProject() {
        this.addProject.close()
    }
}

export default Projects

