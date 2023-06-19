import Menu from "./menu"
import fetchData, { updateData, deleteData } from '../components/data'
import createList from '../components/list'
import createSeparator from "../components/separator"
import createEmptyState from '../components/empty'

class Todos {
    constructor() {
        this.name = 'todos'

        this.container = document.getElementById('home-todos-container')
        this.heading = document.getElementById('home-todos-heading')

        this.addTodoModal = document.getElementById('modal-add-todo')
        this.addTodoShowButton = document.getElementById('modal-add-todo-show-button')
        this.addTodoCloseButton = document.getElementById('modal-add-todo-close-button')

        this.editTodoModal = document.getElementById('modal-edit-todo')
        this.editTodoCloseButtons = document.getElementById('modal-edit-todo-close-button')

        this.deleteTodoModal = document.getElementById('modal-delete-todo')
        this.deleteTodoDeleted = document.getElementById('modal-delete-todo-deleted')
        this.deleteTodoConfirm = document.getElementById('modal-delete-todo-confirm')
        this.deleteTodoCancel = document.getElementById('modal-delete-todo-cancel')
        this.deleteTodoCloseButtons = document.getElementById('modal-delete-todo-close-button')
    }

    async getData(user_id) {
        return await fetchData(`/api/users/${user_id}/todos`)
    }

    async getList(user_id) {
        try {
            const data = await this.getData(user_id)

            createList(data, this.container, 'bg-violet-700', 'bg-violet-200')

            return data
        } catch (err) {
            console.error(err)
        }
    }

    async deleteTodo(todo_id) {
        try {
            const data = await deleteData(`/api/todos/${todo_id}`);
            if (data) {
                location.reload()
            }
        } catch (err) {
            console.error(err);
        }
    }

    async markAsDone(todo_id) {
        try {
            const data = await fetchData(`/api/todos/${todo_id}`)
            data.is_done = true

            const updatedData = await updateData(`/api/todos/${todo_id}`, data)
            if (updatedData) {
                location.reload()
            }
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
        this.addTodoModal.classList.remove('hidden')

        const menu = new Menu()
        menu.closeMenu()
    }

    closeAddTodo() {
        this.addTodoModal.classList.add('hidden')
    }

    showEditTodo() {
        this.editTodoModal.classList.remove('hidden')
    }

    closeEditTodo() {
        this.editTodoModal.classList.add('hidden')
    }

    showDeleteTodo() {
        this.deleteTodoModal.classList.remove('hidden')
    }

    closeDeleteTodo() {
        this.deleteTodoModal.classList.add('hidden')
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)
        const separator = createSeparator('violet')

        this.container.append(separator, emptyBox)

        return emptyBox
    }
}

export default Todos