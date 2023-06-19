const createSeparator = (color) => {
    const separator = document.createElement('span')
    separator.classList.add('w-full', 'h-px', `bg-slate-200`)

    return separator
}

export default createSeparator