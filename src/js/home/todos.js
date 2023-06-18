import Menu from "./menu"
import fetchData from '../components/data'
import createList from '../components/list'
import createSeparator from "../components/separator"
import createEmptyState from '../components/empty'

class Todos {
    constructor() {
        this.name = 'todos'

        this.container = document.getElementById('home-todos-container')
        this.heading = document.getElementById('home-todos-heading')

        this.addTodo = document.getElementById('modal-add-todo')
        this.addTodoShowButton = document.getElementById('modal-add-todo-show-button')
        this.addTodoCloseButton = document.getElementById('modal-add-todo-close-button')

        this.editTodo = document.getElementById('modal-edit-todo')
        this.editTodoCloseButtons = document.getElementById('modal-edit-todo-close-button')

        this.deleteTodo = document.getElementById('modal-delete-todo')
        this.deleteTodoCloseButtons = document.getElementById('modal-delete-todo-close-button')
    }

    async getData(user_id) {
        return await fetchData(`/api/users/${user_id}/todos`)
    }

    async getList(user_id) {
        try {
            const data = await this.getData(user_id)

            createList(data, this.container, 'violet')

            return data
        } catch (err) {
            console.error(err)
        }
    }

    filterByProjects(todos, projectId) {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild)
        }

        this.container.appendChild(this.heading)

        const filtered = todos.filter((todo) => {
            return todo.project_id === parseInt(projectId)
        })

        createList(filtered, this.container, 'violet')
    }

    showAddTodo() {
        this.addTodo.classList.remove('hidden')

        const menu = new Menu()
        menu.closeMenu()
    }

    closeAddTodo() {
        this.addTodo.classList.add('hidden')
    }

    showEditTodo() {
        this.editTodo.classList.remove('hidden')
    }

    closeEditTodo() {
        this.editTodo.classList.add('hidden')
    }

    showDeleteTodo() {
        this.deleteTodo.classList.remove('hidden')
    }

    closeDeleteTodo() {
        this.deleteTodo.classList.add('hidden')
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)
        const separator = createSeparator('violet')

        this.container.append(separator, emptyBox)

        return emptyBox
    }
}

export default Todos