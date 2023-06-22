const createButton = (classList, content, eventListener, name = "", title = "") => {
    const button = document.createElement('button')

    button.className = classList

    button.innerHTML = content

    button.setAttribute('name', name)
    button.setAttribute('title', title)

    button.addEventListener('click', eventListener)

    return button
}

export default createButton