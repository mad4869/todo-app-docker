import '../../css/style.css'

import LoginForm from './form'

if (window.location.pathname == '/login') {
    const form = new LoginForm();

    form.enableSubmit()
    form.validateInput()
    form.validateBlur()
    form.resetFocus()
    form.validateSubmit()
}