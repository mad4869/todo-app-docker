const createButton = (color, content, eventListener, name = "", title = "") => {
    const button = document.createElement('button')

    button.className = 'px-4 py-px text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
    button.classList.add(color)

    button.innerHTML = content

    button.setAttribute('name', name)
    button.setAttribute('title', title)

    button.addEventListener('click', eventListener)

    return button
}

export default createButton