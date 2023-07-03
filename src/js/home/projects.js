import Menu from "./menu"
import Todos from "./todos"
import Dones from "./dones"

import { fetchData, sendData } from "../components/data"
import {
    validate,
    showError,
    resetError,
    enableSubmit,
    validateSubmit
} from '../components/form'
import createButton from "../components/button"
import showNotice from '../components/notice'
import loadAnimation from "../components/animation"
class Projects {
    constructor(user) {
        this.user = user
        this.filter = {
            dropdown: document.getElementById('home-projects-dropdown'),
            options: document.getElementById('home-projects-options'),
            selected: document.getElementById('home-project-selected')
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
    }

    createOption = (title, data, handler) => {
        const option = document.createElement('li')
        option.className = "w-full text-center border-b border-solid border-violet-500 py-2 cursor-pointer hover:bg-teal-600"
        option.textContent = title
        option.setAttribute('data-id', data)
        option.addEventListener('click', handler)

        return option
    }

    createResetFilter = () => {
        const oldReset = document.querySelector('li[data-id="0"]')
        if (oldReset) {
            oldReset.remove()
        }

        const handleReset = () => {
            this.closeOptions()

            this.filter.selected.innerHTML = ''
            loadAnimation(this.filter.selected, 'dots-white')

            const todos = new Todos(this.user)
            const dones = new Dones(this.user)

            todos.resetStack()
            dones.resetStack()

            todos.handleStack()
            dones.handleStack()

            this.filter.selected.innerHTML = reset.textContent
            reset.classList.add('hidden')

            const options = Array.from(reset.parentNode.children).filter(option => option !== reset)
            options.forEach((option) => option.classList.remove('hidden'))
        }

        const reset = this.createOption('All Projects', 0, handleReset)
        reset.classList.add('text-teal-400', 'border-t', 'hover:rounded-b-2xl', 'hover:bg-teal-900')
        reset.classList.remove('border-b', 'hover:bg-teal-600')
        this.filter.options.append(reset)
    }

    createOptions = (data) => {
        for (let i = 0; i < data.length; i++) {
            const handleFilterTasks = async () => {
                this.closeOptions()

                this.filter.selected.innerHTML = ''
                loadAnimation(this.filter.selected, 'dots-white')

                const todos = new Todos(this.user)
                const dones = new Dones(this.user)

                try {
                    const filteredTodos = await todos.filterByProject(option.dataset.id)
                    const filteredDones = await dones.filterByProject(option.dataset.id)

                    if (filteredTodos && filteredDones) {
                        this.filter.selected.innerHTML = option.textContent
                        option.classList.add('hidden')

                        const others = Array.from(option.parentNode.children).filter(other => other !== option)
                        others.forEach((other) => other.classList.remove('hidden'))

                        this.createResetFilter()
                    }
                } catch (err) {
                    console.error(err)
                }
            }

            const option = this.createOption(data[i].title, data[i].project_id, handleFilterTasks)

            this.filter.options.append(option)
        }

        const topOption = this.filter.options.firstElementChild
        topOption.classList.add('hover:rounded-t-2xl')
        const bottomOption = this.filter.options.lastElementChild
        bottomOption.classList.add('hover:rounded-b-2xl')
        bottomOption.classList.remove('border-b')
    }

    getOptions = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/projects`)

            this.createOptions(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    emptyState = () => {
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-white text-white text-xl capitalize rounded-2xl'

        const text = document.createElement('h3')
        text.textContent = "you haven't added any projects yet"

        const handleCta = () => {
            this.showAddModal()
        }

        const ctaButton = createButton('bg-white mt-8 px-4 py-1 text-indigo-700 font-semibold rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase', 'get started', handleCta, 'project-cta-button', 'Create your first project')

        emptyBox.append(text, ctaButton)

        this.filter.options.append(emptyBox)
    }

    handleOptions = async () => {
        const options = await this.getOptions()
        if (!options) {
            this.emptyState()
        }
    }

    showOptions = () => {
        this.filter.options.classList.toggle('hidden')
        this.filter.options.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    handleShowOptions = () => {
        this.filter.dropdown.addEventListener('click', () => {
            this.showOptions()
        })
    }

    closeOptions = () => {
        this.filter.options.classList.add('hidden')
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

    handleClickOutsideModal = () => {
        document.addEventListener('click', (e) => {
            if (this.filter.options) {
                const projectDropdownClicked = this.filter.dropdown.contains(e.target) || this.filter.options.contains(e.target)
                if (!projectDropdownClicked) {
                    this.closeOptions();
                }
            }

            if (this.add.modal) {
                const projectsCtaButton = document.querySelector('button[name="project-cta-button"]')
                let addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target)
                if (projectsCtaButton) {
                    addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target) || projectsCtaButton.contains(e.target)
                }
                if (!addProjectClicked) {
                    this.closeAddModal()
                }
            }
        })
    }

    handleModal = () => {
        this.handleShowOptions()
        this.handleShowAddModal()
        this.handleCloseAddModal()
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

    handleSubmit = (form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            this.add.form.submit.innerHTML = ''
            loadAnimation(this.add.form.submit, 'dots-white')

            const formData = new FormData(form)

            try {
                const res = await validateSubmit(formData, `/api/users/${this.user}/projects`, sendData)
                if (res.success) {
                    location.reload()
                } else {
                    this.add.form.submit.innerHTML = "add"
                    this.closeAddModal()

                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }

    handleForm = () => {
        this.handleInput(this.add.form.fields, this.add.form.submit)
        this.handleBlur(this.add.form.fields)
        this.handleFocus(this.add.form.fields)
        this.handleSubmit(this.add.form.form)
    }
}

export default Projects
