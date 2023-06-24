import { sendData } from '../components/data'
import showNotice from '../components/notice'
import successAnimation from '../../animations/success.json'
import alertAnimation from '../../animations/alert.json'

class RegisterForm {
    constructor() {
        this.form = document.querySelector('form')
        this.fields = {
            name: document.getElementById('form-register-name'),
            role: document.getElementById('form-register-role'),
            email: document.getElementById('form-register-email'),
            password: document.getElementById('form-register-password'),
            confirmPassword: document.getElementById('form-register-confirm-password')
        }
        this.submit = document.getElementById('form-register-submit')
    }

    validate = (field) => {
        return field.checkValidity()
    }

    validatePasswordMatch = (confirmPassword) => {
        const { password } = this.fields
        if (confirmPassword.value !== password.value) {
            confirmPassword.setCustomValidity('Passwords do not match.')
        } else confirmPassword.setCustomValidity('')

        return confirmPassword.checkValidity()
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

                if (this.fields[field] === this.fields['confirmPassword']) {
                    isValid = this.validatePasswordMatch(this.fields[field])
                }

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

            if (this.fields[field] === this.fields['confirmPassword']) {
                isValid = this.validatePasswordMatch(this.fields[field])
            }

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
                const res = await sendData('/auth/register', formData)
                if (res.success) {
                    showNotice('Your account has been registered. Please login to proceed.', 'success', successAnimation)
                    setTimeout(() => {
                        window.location.replace('/login')
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

export default RegisterForm