import Menu from "./menu"

class Projects {
    constructor() {
        this.projectsDropdown = document.getElementById('home-projects-dropdown')
        this.projectsOptions = document.getElementById('home-projects-options')
        // this.isProjectOptionsVisible = false;
        this.addProject = document.getElementById('modal-add-project')
        this.addProjectShowButton = document.getElementById('modal-add-project-show-button')
        this.addProjectCloseButton = document.getElementById('modal-add-project-close-button')
    }

    showProjectOptions() {
        this.projectsOptions.classList.remove('invisible')
        this.projectsOptions.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    closeProjectOptions() {
        this.projectsOptions.classList.add('invisible')
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

