import { createTodoCard } from './card'
import createSeparator from './separator'

const createStack = (arr, category, container, separatorColor) => {
    for (let i = 0; i < arr.length; i++) {
        const id = arr[i].todo_id
        const title = JSON.stringify(arr[i].title).split('"').join('')
        const project = JSON.stringify(arr[i].project_title).split('"').join('')
        const description = JSON.stringify(arr[i].description).split('"').join('')

        const card = createTodoCard(id, title, project, description, category)

        const separator = createSeparator(separatorColor)

        container.append(separator, card)
    }
}

export default createStack