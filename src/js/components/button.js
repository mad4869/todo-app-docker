// Create and return a button element
// Params: classList (string) -> the list of classes to style the button
//         content (string) -> the content of the button
//         handler (function) -> a callback function for the button's click event
//         name (string) -> the name of the button
//         title (string) -> the title of the button
// Return: button (HTML element) -> a button element

const createButton = (classList, content, handler, name = "", title = "") => {
    const button = document.createElement('button')

    button.className = classList
    button.innerHTML = content

    button.setAttribute('name', name)
    button.setAttribute('title', title)

    button.addEventListener('click', handler)

    return button
}

export default createButton
