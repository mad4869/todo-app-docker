import { createCardEmptyState } from "./empty"

const createList = (data) => {
    const list = document.createElement('ul')
    list.className = 'h-full flex flex-col justify-center pl-4 pr-8'

    if (data.length === 0) {
        const empty = createCardEmptyState(data[i].project_id)

        list.append(empty)

        return list
    }

    for (let i = 0; i < data.length; i++) {
        const todo = document.createElement('li')
        todo.className = 'flex justify-between items-center border-b border-solid border-slate-300'

        const title = document.createElement('h6')
        title.className = 'text-xs'
        title.textContent = data[i].title

        const badge = document.createElement('div')
        data[i].is_done === false ?
            badge.innerHTML = '<i class="fa-regular fa-hourglass fa-xs text-violet-700"></i>' :
            badge.innerHTML = '<i class="fa-solid fa-circle-check fa-xs text-teal-600"></i>'

        todo.append(title, badge)

        list.append(todo)
    }

    list.lastElementChild.classList.remove('border-b')

    return list
}

export default createList