import loadAnimation from './animation'

const showNotice = (message, category, animationData) => {
    const mainContainer = document.createElement('div')
    mainContainer.className = 'fixed flex gap-2 items-center left-1/2 -translate-x-1/2 bottom-10 px-8 py-1 rounded-2xl transition-opacity'
    mainContainer.classList.add(category)

    const animationContainer = document.createElement('div')
    animationContainer.className = 'h-20'
    loadAnimation(animationContainer, animationData)

    const messageContainer = document.createElement('div')
    messageContainer.className = 'text-white'
    messageContainer.innerHTML = message

    mainContainer.append(animationContainer, messageContainer)
    document.getElementById('content').appendChild(mainContainer)

    setTimeout(() => {
        mainContainer.classList.add('hidden')
    }, 3000)
}

export default showNotice