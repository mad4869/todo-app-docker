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

    // getProjects() {
    //     const xhr = new XMLHttpRequest()
    // xhr.open('GET', '/api/projects', true)
    // xhr.onreadystatechange = () => {
    //     if (xhr.readyState === 4) {
    //         if (xhr.status === 200 && xhr.status !== 0) {
    //             const res = JSON.parse(xhr.responseText)

    //             const dropdownProjectContainer = document.getElementById('dropdown-project-items')
    //             for (let i = 0; i < res.length; i++) {
    //                 const dropdownProjectItems = document.createElement('span')
    //                 dropdownProjectItems.className = "w-full text-center border-b border-solid border-violet-500 py-2 hover:bg-teal-600 hover:rounded-t-2xl"
    //                 dropdownProjectItems.textContent = JSON.stringify(res[i].title).split('"').join('')
    //                 dropdownProjectItems.setAttribute('data-value', res[i].project_id)
    //                 dropdownProjectContainer.appendChild(dropdownProjectItems)
    //             }
    //             dropdownProjectContainer.lastChild.classList.remove('border-b')
    //         } else {
    //             console.log('Request failed:', xhr.status)
    //         }
    //     }
    // }
    // xhr.send()
    // }

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

