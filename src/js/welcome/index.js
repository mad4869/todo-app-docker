import '../../css/style.css'

import loadAnimations from "./animation";

if (window.location.pathname == '/welcome') {
    // import('./animation')
    //     .then((animation) => {
    //         animation.default()
    //     })
    loadAnimations()
}