const createEmptyState = (cat) => {
    const container = document.createElement('div')
    const text = document.createElement('h3')
    const illustration = document.createElement('img')
    const button = document.createElement('button')

    container.className = 'flex flex-col gap-2 justify-center items-center w-full border border-dashed py-10 text-xl capitalize'

    illustration.className = 'w-20'
    illustration.setAttribute('alt', 'This column is empty')

    switch (cat) {
        case 'todos':
            container.classList.add('border-violet-700', 'text-violet-700')
            illustration.setAttribute('src', '/static/dist/img/empty-primary.svg')
            text.textContent = "you haven't added any tasks yet"
            button.textContent = 'get started'
            button.className = 'bg-violet-700 mt-8 px-4 py-1 text-white font-semibold rounded-xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase'

            container.append(illustration, text, button)
            break
        case 'dones':
            container.classList.add('border-teal-700', 'text-teal-700')
            illustration.setAttribute('src', '/static/dist/img/empty-secondary.svg')
            text.textContent = "you haven't finished any tasks yet"

            container.append(illustration, text)
            break
        default:
            return
    }

    return container
}

export default createEmptyState