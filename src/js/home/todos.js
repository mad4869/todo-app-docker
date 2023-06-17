import Menu from "./menu"
import makeCard from '../components/card'
import createEmptyState from '../components/empty'

class Todos {
    constructor() {
        this.name = 'todos'

        this.container = document.getElementById('home-todos-container')
        this.heading = document.getElementById('home-todos-heading')

        this.addTodo = document.getElementById('modal-add-todo')
        this.addTodoShowButton = document.getElementById('modal-add-todo-show-button')
        this.addTodoCloseButton = document.getElementById('modal-add-todo-close-button')
    }

    getData(user_id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText)
                    resolve(res)
                } else {
                    reject(new Error('Failed to fetch data'))
                }
            }

            xhr.open('GET', `/api/users/${user_id}/todos`, true)
            xhr.send()
        })
    }

    async getList(user_id) {
        try {
            const data = await this.getData(user_id)

            for (let i = 0; i < data.length; i++) {
                const title = JSON.stringify(data[i].title).split('"').join('')
                const project = JSON.stringify(data[i].project_title).split('"').join('')
                const description = JSON.stringify(data[i].description).split('"').join('')

                const card = makeCard(title, project, description)

                const separator = document.createElement('span')
                separator.classList.add('w-full', 'h-px', 'bg-violet-200')

                this.container.append(separator, card)
            }

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

        for (let i = 0; i < filtered.length; i++) {
            const title = JSON.stringify(filtered[i].title).split('"').join('')
            const project = JSON.stringify(filtered[i].project_title).split('"').join('')
            const description = JSON.stringify(filtered[i].description).split('"').join('')

            const card = makeCard(title, project, description)

            const separator = document.createElement('span')
            separator.classList.add('w-full', 'h-px', 'bg-violet-200')

            this.container.append(separator, card)
        }
    }

    showAddTodo() {
        this.addTodo.classList.remove('hidden')

        const menu = new Menu()
        menu.closeMenu()
    }

    closeAddTodo() {
        this.addTodo.classList.add('hidden')
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)

        const separator = document.createElement('span')
        separator.classList.add('w-full', 'h-px', 'bg-violet-200')

        this.container.append(separator, emptyBox)

        return emptyBox
    }
}

export default Todos
// const editTaskModal = document.getElementById('edit-task')
// const deleteTaskModal = document.getElementById('delete-task')

// const editTaskForm = document.getElementById('edit-task-form')
// const editModalButton = document.getElementById('edit-button')
// const deleteModalButton = document.getElementById('delete-button')
// deleteModalButton.addEventListener('click', function () {
//     deleteTaskModal.show()

//     const deletedTask = document.getElementById('deleted-task')

// })

// const closeEdit = document.getElementById('close-edit')
// closeEdit.addEventListener('click', function () {
//     editTaskModal.close()
// })

// const closeDelete = document.getElementById('close-delete')
// closeDelete.addEventListener('click', function () {
//     deleteTaskModal.close()
// })