import { sendData } from '../components/data'
import { validate, validatePasswordMatch, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import showNotice from '../components/notice'
import loadAnimation from '../components/animation'

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

    handleForm = () => {
        this.handleInput()
        this.handleBlur()
        this.handleFocus()
        this.handleSubmit()
    }

    handleBlur = () => {
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
            loadAnimation(this.submit, 'dots-white')

            const formData = new FormData(this.form)

            try {
                const res = await validateSubmit(formData, 'auth/register', sendData)
                if (res.success) {
                    window.location.replace('/login')
                } else {
                    this.submit.innerHTML = 'create account'

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