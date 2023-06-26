import Menu from "./menu"

import { fetchData, sendData } from "../components/data"
import { validate, showError, resetError, enableSubmit } from '../components/form'
import createButton from "../components/button"
import showNotice from '../components/notice'
import successAnimation from '../../animations/success.json'
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
            show: document.getElementById('modal-add-project-show-button'),
            close: document.getElementById('modal-add-project-close-button'),
            form: {
                form: document.getElementById('form-add-project'),
                fields: {
                    title: document.getElementById('form-add-project-title'),
                    description: document.getElementById('form-add-project-description')
                },
                submit: document.getElementById('form-add-project-submit')
            }
        }
    }

    attachEventListeners = () => {
        this.filter.dropdown.addEventListener('click', () => {
            this.showOptions()
        })
        this.add.show.addEventListener('click', () => {
            this.showAddModal()

            const menu = new Menu()
            menu.closeMenu()
        })
        this.add.close.addEventListener('click', () => {
            this.closeAddModal()
        })
        this.validateInput()
        this.validateBlur()
        this.resetFocus()
        this.validateSubmit()
    }

    getOptions = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/projects`)

            for (let i = 0; i < data.length; i++) {
                const option = document.createElement('li')
                option.className = "w-full text-center border-b border-solid border-violet-500 py-2 cursor-pointer hover:bg-teal-600"
                option.textContent = JSON.stringify(data[i].title).split('"').join('')
                option.setAttribute('data-value', data[i].project_id)

                this.filter.options.append(option)
            }

            const topOption = this.filter.options.firstElementChild
            topOption.classList.add('hover:rounded-t-2xl')
            const bottomOption = this.filter.options.lastElementChild
            bottomOption.classList.add('hover:rounded-b-2xl')
            bottomOption.classList.remove('border-b')

            return this.filter.options.childNodes
        } catch (err) {
            console.error(err)
        }
    }

    showOptions = () => {
        this.filter.options.classList.toggle('hidden')
        this.filter.options.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    closeOptions = () => {
        this.filter.options.classList.add('hidden')
    }

    showAddModal = () => {
        this.add.modal.classList.remove('hidden')
    }

    closeAddModal = () => {
        this.add.modal.classList.add('hidden')
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

        this.filter.options.appendChild(emptyBox)
    }

    validateBlur = () => {
        const fields = this.add.form.fields
        for (const field in fields) {
            fields[field].addEventListener('blur', () => {
                let isValid = validate(fields[field])

                if (!isValid) {
                    showError(fields[field])
                }
            })
        }
    }

    resetFocus = () => {
        const fields = this.add.form.fields
        for (const field in fields) {
            fields[field].addEventListener('focus', () => {
                resetError(fields[field])
            })
        }
    }

    validateInput = () => {
        const fields = this.add.form.fields
        const submit = this.add.form.submit
        for (const field in fields) {
            fields[field].addEventListener('input', () => {
                enableSubmit(fields, submit)
            })
        }
    }

    validateSubmit = () => {
        const form = this.add.form.form
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            this.closeAddModal()

            const formData = new FormData(form)

            try {
                const res = await sendData(`/api/users/${this.user}/projects`, formData)
                if (res.success) {
                    showNotice('Your project has been added!', 'success', successAnimation)
                } else {
                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error', alertAnimation)
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default Projects