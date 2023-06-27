import { sendData } from '../components/data'
import { validate, showError, resetError, enableSubmit } from '../components/form'
import showNotice from '../components/notice'

class LoginForm {
    constructor() {
        this.form = document.querySelector('form')
        this.fields = {
            email: document.getElementById('form-login-email'),
            password: document.getElementById('form-login-password')
        }
        this.submit = document.getElementById('form-login-submit')
    }

    attachEventListeners = () => {
        enableSubmit(this.fields, this.submit)
        this.validateInput()
        this.validateBlur()
        this.resetFocus()
        this.validateSubmit()
    }

    validateBlur = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('blur', () => {
                let isValid = validate(this.fields[field])

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
            this.submit.value = '...'

            const formData = new FormData(this.form)

            try {
                const res = await sendData('/auth/login', formData)
                if (res.success) {
                    this.submit.value = 'LOGIN SUCCESSFUL'

                    localStorage.setItem('access_token', res.access_token)
                    localStorage.setItem('refresh_token', res.refresh_token)

                    window.location.replace('/home')
                } else {
                    this.submit.value = 'LOGIN'

                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default LoginForm