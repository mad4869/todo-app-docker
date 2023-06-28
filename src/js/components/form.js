const validate = (field) => {
    return field.checkValidity()
}

const validatePasswordMatch = (password, confirmPassword) => {
    if (confirmPassword.value !== password.value) {
        confirmPassword.setCustomValidity('Passwords do not match.')
    } else confirmPassword.setCustomValidity('')

    return confirmPassword.checkValidity()
}

const createError = (field) => {
    const error = document.createElement('p')
    error.className = 'mt-1 text-xs text-rose-500 italic'
    error.setAttribute('name', 'error')
    error.textContent = field.validationMessage

    return error
}

const showError = (field) => {
    field.classList.remove('border-slate-500', 'placeholder:text-slate-400')
    field.classList.add('border-rose-500', 'placeholder:text-rose-300')

    field.parentElement.append(createError(field))
}

const resetError = (field) => {
    field.classList.remove('border-rose-500', 'placeholder:text-rose-300')
    field.classList.add('border-slate-500', 'placeholder:text-slate-400')

    const error = field.parentElement.querySelector('p[name="error"]')
    error ? error.remove() : ''
}

const enableSubmit = (fields, submit) => {
    const results = {}

    for (const field in fields) {
        let isValid = validate(fields[field])

        if (!isValid) {
            results[field] = fields[field].validationMessage
        } else {
            results[field] = ''
        }
    }

    const hasErrors = Object.values(results).some(error => error !== '')
    submit.disabled = hasErrors
}

const validateSubmit = async (formData, apiUrl, method) => {
    try {
        const res = await method(apiUrl, formData)

        return res
    } catch (err) {
        console.error(err)
    }
}

export { validate, validatePasswordMatch, showError, resetError, enableSubmit, validateSubmit }