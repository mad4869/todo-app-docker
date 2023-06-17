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
        } catch (err) {
            console.error(err)
        }
    }

    filterByProjects(todos, project) {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild)
        }

        this.container.appendChild(this.heading)

        const filtered = todos.filter((todo) => {
            return todo.project_id === parseInt(project)
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
        this.addTodo.show()

        const menu = new Menu()
        menu.closeMenu()
    }

    closeAddTodo() {
        this.addTodo.close()
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)

        const separator = document.createElement('span')
        separator.classList.add('w-full', 'h-px', 'bg-violet-200')

        this.container.append(separator, emptyBox)
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

// const addTaskSubmit = document.getElementById('add-task-submit')
// addTaskSubmit.addEventListener('click', function (e) {
//     e.preventDefault()

//     const addTaskForm = document.getElementById('add-task-form')
//     const project = addTaskForm.elements['project'].value
//     const title = addTaskForm.elements['title'].value
//     const description = addTaskForm.elements['description'].value

//     const todoContainer = document.createElement('div')
//     todoContainer.className = 'w-full pb-2 border border-solid border-violet-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'

//     const todoHeading = document.createElement('div')
//     todoHeading.className = 'flex justify-between items-center px-4 py-2 bg-violet-700'

//     const todoTitle = document.createElement('h1')
//     todoTitle.className = 'flex-1 text-xl text-white font-semibold'
//     todoTitle.innerHTML = title

//     const todoProjectContainer = document.createElement('span')
//     todoProjectContainer.className = 'px-2 py-1 border border-solid border-white rounded-full'
//     const todoProject = document.createElement('h3')
//     todoProject.className = 'text-white text-sm'
//     todoProject.innerHTML = project
//     todoProjectContainer.appendChild(todoProject)

//     todoHeading.append(todoTitle, todoProjectContainer)

//     const todoDescription = document.createElement('div')
//     todoDescription.className = 'px-4 py-2'

//     const todoDescriptionContent = document.createElement('p')
//     todoDescriptionContent.className = 'text-xs'
//     todoDescriptionContent.innerHTML = description
//     todoDescription.appendChild(todoDescriptionContent)

//     const todosContainer = document.getElementById('todos-container')

//     const separator = document.createElement('span')
//     separator.className = 'w-full h-px bg-violet-200'

//     const buttonsContainer = document.createElement('div')
//     buttonsContainer.className = 'flex justify-between px-4'

//     const leftButtons = document.createElement('span')
//     const rightButtons = document.createElement('span')

//     const editButton = document.createElement('button')
//     editButton.className = 'mr-1 px-2 py-px bg-teal-500 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
//     editButton.innerHTML = 'Edit'
//     const deleteButton = document.createElement('button')
//     deleteButton.className = 'px-2 py-px bg-rose-600 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
//     deleteButton.innerHTML = 'Delete'
//     const doneButton = document.createElement('button')
//     doneButton.className = 'px-4 py-px bg-violet-700 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
//     doneButton.setAttribute('title', 'Mark as done')
//     doneButton.innerHTML = '<i class="fa-solid fa-check"></i>'

//     leftButtons.append(editButton, deleteButton)
//     rightButtons.appendChild(doneButton)
//     buttonsContainer.append(leftButtons, rightButtons)

//     todoContainer.append(todoHeading, todoDescription, buttonsContainer)

//     todosContainer.append(separator, todoContainer)

//     addTaskForm.reset()
//     addTaskModal.close()
// })