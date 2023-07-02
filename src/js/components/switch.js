const todoToDone = (dropped, newButton) => {
    const heading = dropped.firstElementChild
    heading.classList.remove('bg-violet-700', 'text-white')
    heading.classList.add('bg-teal-600', 'text-teal-500')

    const label = heading.lastElementChild
    label.classList.remove('border-white')
    label.classList.add('border-teal-500')

    const description = heading.nextElementSibling
    description.classList.add('text-neutral-400')

    const leftButtons = dropped.lastElementChild.firstElementChild
    const editButton = leftButtons.firstElementChild
    editButton.classList.remove('text-white')
    editButton.classList.add('text-emerald-500')
    const deleteButton = leftButtons.lastElementChild
    deleteButton.classList.remove('text-white')
    deleteButton.classList.add('text-rose-500')

    const rightButtons = dropped.lastElementChild.lastElementChild
    const oldButton = rightButtons.firstElementChild
    oldButton.remove()
    rightButtons.append(newButton)
}

const doneToTodo = (dropped, newButton) => {
    const heading = dropped.firstElementChild
    heading.classList.remove('bg-teal-600', 'text-teal-500')
    heading.classList.add('bg-violet-700', 'text-white')

    const label = heading.lastElementChild
    label.classList.remove('border-teal-500')
    label.classList.add('border-white')

    const description = heading.nextElementSibling
    description.classList.remove('text-neutral-400')

    const leftButtons = dropped.lastElementChild.firstElementChild
    const editButton = leftButtons.firstElementChild
    editButton.classList.remove('text-emerald-500')
    editButton.classList.add('text-white')
    const deleteButton = leftButtons.lastElementChild
    deleteButton.classList.remove('text-rose-500')
    deleteButton.classList.add('text-white')

    const rightButtons = dropped.lastElementChild.lastElementChild
    const oldButton = rightButtons.firstElementChild
    oldButton.remove()
    rightButtons.append(newButton)
}

const getNextElement = (container, y) => {
    const otherElements = [...container.querySelectorAll('div[draggable="true"]:not(.opacity-50)')]

    return otherElements.reduce((next, element) => {
        const box = element.getBoundingClientRect()
        const offset = y - (box.top + box.height / 2)
        if (offset < 0 && offset > next.offset) {
            return { offset, nextElement: element }
        } else {
            return next
        }
    }, { offset: Number.NEGATIVE_INFINITY })
}

export { todoToDone, doneToTodo, getNextElement }