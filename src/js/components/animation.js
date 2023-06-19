import Lottie from 'lottie-web';

const loadAnimation = (container, animationData) => {
    Lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData
    })
}

export default loadAnimation