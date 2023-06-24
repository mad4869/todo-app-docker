import { sendData } from '../components/data'
import showNotice from '../components/notice'
import helloAnimation from '../../animations/hello.json'
import alertAnimation from '../../animations/alert.json'

class LoginForm {
    constructor() {
        this.form = document.querySelector('form')
        this.fields = {
            email: document.getElementById('form-login-email'),
            password: document.getElementById('form-login-password')
        }
        this.submit = document.getElementById('form-login-submit')
    }

    validate = (field) => {
        return field.checkValidity()
    }

    getMessage = (field) => {
        return field.validationMessage
    }

    createError = (field) => {
        const error = document.createElement('p')
        error.className = 'mt-1 text-xs text-rose-500 italic'
        error.setAttribute('name', 'error')
        error.textContent = this.getMessage(field)

        return error
    }

    showError = (field) => {
        field.classList.remove('border-slate-500', 'placeholder:text-slate-400')
        field.classList.add('border-rose-500', 'placeholder:text-rose-300')

        field.parentElement.append(this.createError(field))
    }

    resetError = (field) => {
        field.classList.remove('border-rose-500', 'placeholder:text-rose-300')
        field.classList.add('border-slate-500', 'placeholder:text-slate-400')

        const error = field.parentElement.querySelector('p[name="error"]')
        error ? error.remove() : ''
    }

    validateBlur = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('blur', () => {
                let isValid = this.validate(this.fields[field])

                if (!isValid) {
                    this.showError(this.fields[field])
                }
            })
        }
    }

    resetFocus = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('focus', () => {
                this.resetError(this.fields[field])
            })
        }
    }

    enableSubmit = (fields) => {
        const results = {}

        for (const field in fields) {
            let isValid = this.validate(this.fields[field])

            if (!isValid) {
                results[field] = this.getMessage(fields[field])
            } else {
                results[field] = ''
            }
        }

        const hasErrors = Object.values(results).some(error => error !== '')
        this.submit.disabled = hasErrors
    }

    validateInput = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('input', () => {
                this.enableSubmit(this.fields)
            })
        }
    }

    validateSubmit = () => {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(this.form)

            try {
                const res = await sendData('/auth/login', formData)
                if (res.success) {
                    showNotice('<span class="font-semibold">Login successful. Welcome back!</span><br>Please wait a moment while we redirect you to the homepage.', 'success', helloAnimation)
                    localStorage.setItem('access_token', res.access_token)
                    localStorage.setItem('refresh_token', res.refresh_token)
                    setTimeout(() => {
                        window.location.replace('/home')
                    }, 3000)
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

export default LoginForm