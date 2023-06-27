import loadAnimation from './components/animation'

const flash = document.getElementById('flash')
const animation = document.getElementById('flash-animation')
const category = flash.dataset.category

loadAnimation(animation, category)

setTimeout(() => {
    if (flash) {
        flash.classList.add('hidden')
    }
}, 3000)