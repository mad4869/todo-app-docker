import Projects from "../projects/projects"

const createCardEmptyState = (dataId) => {
    const emptyBox = document.createElement('li')
    emptyBox.className = 'mx-auto'

    const button = document.createElement('button')
    button.className = 'flex gap-2 items-center px-4 py-1 text-indigo-700 font-semibold border border-dashed border-indigo-700 rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.3)] uppercase'
    button.innerHTML = '<i class="fa-solid fa-circle-plus fa-sm text-indigo-700"></i><span>add your first task</span>'
    button.addEventListener('click', () => {
        const projects = new Projects()
        projects.showAddTodo()

        document.getElementById('form-add-todo-project').value = dataId
    })

    emptyBox.append(button)

    return emptyBox
}

export { createCardEmptyState }