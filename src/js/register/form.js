import { sendData } from '../components/data'
import { validate, validatePasswordMatch, showError, resetError, enableSubmit } from '../components/form'
import showNotice from '../components/notice'

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

    attachEventListeners = () => {
        this.validateInput()
        this.validateBlur()
        this.resetFocus()
        this.validateSubmit()
    }

    validateBlur = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('blur', () => {
                let isValid = validate(this.fields[field])

                if (this.fields[field] === this.fields['confirmPassword']) {
                    isValid = validatePasswordMatch(this.fields['password'], this.fields[field])
                }

                if (!isValid) {
                    showError(this.fields[field])
                }
            })
        }
    }

    resetFocus = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('focus', () => {
                resetError(this.fields[field])
            })
        }
    }

    validateInput = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('input', () => {
                enableSubmit(this.fields, this.submit)
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
                    showNotice('Your account has been registered. Please login to proceed.', 'success')
                    setTimeout(() => {
                        window.location.replace('/login')
                    }, 3000)
                } else {
                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default RegisterForm