import Lottie from 'lottie-web';

import successAnimation from '../../animations/success.json'
import alertAnimation from '../../animations/alert.json'
import infoAnimation from '../../animations/info.json'
import helloAnimation from '../../animations/hello.json'
import dotsAnimation from '../../animations/dots.json'

// Use Lottie to load animation based on categories

const loadAnimation = (container, category) => {
    let animationData = null

    switch (category) {
        case 'success':
            animationData = successAnimation
            break
        case 'error':
            animationData = alertAnimation
            break
        case 'info':
            animationData = infoAnimation
            break
        case 'hello':
            animationData = helloAnimation
            break
        case 'dots':
            animationData = dotsAnimation
            break
        default:
            animationData = null
    }

    Lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData
    })
}

export default loadAnimation