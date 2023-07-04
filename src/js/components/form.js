// Inspect if a field satisfies the required value 
// Params: field (HTML element) -> an input field element
// Return: boolean -> true if the field satisfies the required value, false if not
const validate = (field) => {
    return field.checkValidity()
}

// Inspect if the confirm password field value matches the password field value
// Params: password (HTML element) -> an input field element containing password data
//         confirmPassword (HTML element) -> an input field to confirm the password data
// Return: boolean -> true if the confirmed password matches the password, false if not
const validatePasswordMatch = (password, confirmPassword) => {
    if (confirmPassword.value !== password.value) {
        confirmPassword.setCustomValidity('Passwords do not match.')
    } else confirmPassword.setCustomValidity('')

    return confirmPassword.checkValidity()
}

// Create and return an error message
// Params: field (HTML element) -> an input field element
// Return: error (HTML element) -> a 'p' element containing an error message
const createError = (field) => {
    const error = document.createElement('p')
    error.className = 'mt-1 text-xs text-rose-500 italic'
    error.setAttribute('name', 'error')
    error.textContent = field.validationMessage // containing error message if a field is invalid

    return error
}

// Attach the error message below the input field
// Params: field (HTML element) -> an input field element
// Return: None
const showError = (field) => {
    field.classList.remove('border-slate-500', 'placeholder:text-slate-400')
    field.classList.add('border-rose-500', 'placeholder:text-rose-300')

    field.parentElement.append(createError(field))
}

// Remove the error message below the input field if the error message is present
// Params: field (HTML element) -> an input field element
// Return: None
const resetError = (field) => {
    field.classList.remove('border-rose-500', 'placeholder:text-rose-300')
    field.classList.add('border-slate-500', 'placeholder:text-slate-400')

    const error = field.parentElement.querySelector('p[name="error"]')
    error ? error.remove() : ''
}

// Enable the submit button if all the required input field are valid
// Params: field (HTML element) -> an input field element
//         submit (HTML element) -> a submit button element
// Return: None
const enableSubmit = (fields, submit) => {
    const results = {}

    for (const field in fields) {
        // Check if each field is valid
        let isValid = validate(fields[field])

        // For the confirm password field, check if it matches the password field
        if (fields[field] === fields['confirmPassword']) {
            isValid = validatePasswordMatch(fields['password'], fields[field])
        }

        // If one of the field is invalid, insert the error message into the 'results' object
        if (!isValid) {
            results[field] = fields[field].validationMessage
        } else {
            results[field] = ''
        }
    }

    // Check if the 'results' object contains any error message 
    const hasErrors = Object.values(results).some(error => error !== '')
    // Enable the submit button if there is no error message inside the 'results' object
    submit.disabled = hasErrors
}

// Send the form data to be validated after it got submitted
// Params: formData (FormData) -> a FormData object containing the data from the user
//         apiUrl (string) -> the url/route of the api endpoint
//         method (function) -> the function to make an api call
// Return: res (object) -> the response of the request
const validateSubmit = async (formData, apiUrl, method) => {
    try {
        const res = await method(apiUrl, formData)

        return res
    } catch (err) {
        console.error(err)
    }
}

export { validate, validatePasswordMatch, showError, resetError, enableSubmit, validateSubmit }