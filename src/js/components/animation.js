import Lottie from 'lottie-web';

import successAnimation from '../../animations/success.json'
import alertAnimation from '../../animations/alert.json'
import infoAnimation from '../../animations/info.json'
import helloAnimation from '../../animations/hello.json'

const loadAnimation = (container, category) => {
    let animationData = null

    switch (category) {
        case 'success':
            animationData = successAnimation
            break
        case 'alert':
            animationData = alertAnimation
            break
        case 'info':
            animationData = infoAnimation
            break
        case 'hello':
            animationData = helloAnimation
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