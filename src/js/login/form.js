import { sendData } from '../components/data'
import { validate, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import showNotice from '../components/notice'
import loadAnimation from '../components/animation'

class LoginForm {
    constructor() {
        this.form = document.querySelector('form')
        this.fields = {
            email: document.getElementById('form-login-email'),
            password: document.getElementById('form-login-password')
        }
        this.submit = document.getElementById('form-login-submit')
    }

    attachHandlers = () => {
        enableSubmit(this.fields, this.submit)
        this.handleInput()
        this.handleBlur()
        this.handleFocus()
        this.handleSubmit()
    }

    handleBlur = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('blur', () => {
                let isValid = validate(this.fields[field])

                if (!isValid) {
                    showError(this.fields[field])
                }
            })
        }
    }

    handleFocus = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('focus', () => {
                resetError(this.fields[field])
            })
        }
    }

    handleInput = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('input', () => {
                enableSubmit(this.fields, this.submit)
            })
        }
    }

    handleSubmit = () => {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            this.submit.innerHTML = ''
            loadAnimation(this.submit, 'dots')

            const formData = new FormData(this.form)

            try {
                const res = await validateSubmit(formData, '/auth/login', sendData)
                if (res.success) {
                    localStorage.setItem('access_token', res.access_token)
                    localStorage.setItem('refresh_token', res.refresh_token)

                    window.location.replace('/home')
                } else {
                    this.submit.innerHTML = 'login'

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