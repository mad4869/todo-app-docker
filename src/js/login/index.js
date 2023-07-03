import '../../css/style.css'

import LoginForm from './form'
import { handleFlash } from '../components/notice'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

const form = new LoginForm();
form.handleForm()