import '../../css/style.css'

import { handleFlash } from '../components/notice'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}