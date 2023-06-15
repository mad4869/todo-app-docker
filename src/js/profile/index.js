import '../../css/style.css'

import setClock from '../components/clock'
import showYear from '../components/year'

if (window.location.pathname == '/profile') {
    // Footer
    setInterval(setClock, 1000)
    showYear()
}