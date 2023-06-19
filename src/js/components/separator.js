const createSeparator = (color) => {
    const separator = document.createElement('span')
    separator.className = 'w-full h-px'
    separator.classList.add(color)

    return separator
}

export default createSeparator