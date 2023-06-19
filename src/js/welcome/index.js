import '../../css/style.css'

import loadAnimation from "../components/animation";
import bgData from '../../animations/background.json'
import loadingData from '../../animations/loading.json'

if (window.location.pathname == '/welcome') {
    const bgContainer = document.getElementById('welcome-bg-container')
    const loadingContainer = document.getElementById('welcome-loading-container')

    loadAnimation(bgContainer, bgData)
    loadAnimation(loadingContainer, loadingData)
}