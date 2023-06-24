import '../../css/style.css'

// import Menu from './menu'
// import Projects from './projects'
// import Todos from './todos'
// import Dones from './dones'
// import createButton from '../components/button'
// import createSeparator from '../components/separator'
// import setClock from '../components/clock'
// import showYear from '../components/year'

// // if (window.location.pathname == '/home') {
// const access_token = localStorage.getItem('accessToken')
// console.log(access_token)

// fetch('/home', {
//     headers: {
//         Authorization: `Bearer ${access_token}`
//     }
// })
//     .then(res => res.text)
//     .catch(err => {
//         console.log(err)
//     })

// // Logged in user
// const userId = document.getElementById('current-user').dataset.user

// // List of todos
// const todos = new Todos()

// const todosList = await todos.getStack(userId)

// if (todosList.length === 0) {
//     const empty = todos.emptyState()
//     const getStartedButton = empty.lastElementChild
//     getStartedButton.addEventListener('click', () => {
//         todos.showAddTodo()
//     })
// }

// todos.editTodoCloseButtons.addEventListener('click', () => {
//     todos.closeEditTodo()
// })

// todos.deleteTodoCloseButtons.addEventListener('click', () => {
//     todos.closeDeleteTodo()
// })

// // List of dones
// const dones = new Dones()

// const donesList = await dones.getStack(userId)

// if (donesList.length === 0) {
//     dones.emptyState()
// }

// // Projects dropdown
// const projects = new Projects()

// projects.dropdown.addEventListener('click', () => {
//     projects.showOptions()
// })

// const options = await projects.getOptions(userId)

// // Filter todos by projects
// if (options) {
//     options.forEach((option) => {
//         option.addEventListener('click', async () => {
//             projects.selected.textContent = option.textContent
//             projects.closeOptions()

//             const todosData = await todos.getData(userId)
//             todos.filterByProjects(todosData, option.dataset.value)

//             const donesData = await dones.getData(userId)
//             dones.filterByProjects(donesData, option.dataset.value)
//         })
//     })
// } else {
//     const empty = projects.emptyState()
//     const getStartedButton = empty.lastElementChild
//     getStartedButton.addEventListener('click', () => {
//         projects.showAddProject()
//         projects.closeOptions()
//     })
// }

// // Sliding menu
// const menu = new Menu()
// menu.showMenuButton.addEventListener('click', () => {
//     menu.showMenu()
// })

// // Add task modal
// todos.addTodoShowButton.addEventListener('click', () => {
//     todos.showAddTodo()
// })
// todos.addTodoCloseButton.addEventListener('click', () => {
//     todos.closeAddTodo()
// })

// // Add project modal
// projects.addProjectShowButton.addEventListener('click', () => {
//     projects.showAddProject()
// })
// projects.addProjectCloseButton.addEventListener('click', () => {
//     projects.closeAddProject()
// })
// // Draggable tasks
// let originalContainer = null
// const allTasks = document.querySelectorAll('div[draggable="true"]')
// allTasks.forEach((task) => {
//     task.addEventListener('dragstart', (e) => {
//         originalContainer = e.target.parentNode
//         e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'))

//         setTimeout(() => {
//             e.target.classList.add('hidden');
//             e.target.previousElementSibling.classList.add('hidden')
//         }, 0);
//     })
//     task.addEventListener('dragend', (e) => {
//         e.target.classList.remove('hidden')
//         e.target.previousElementSibling.classList.remove('hidden')
//     })
// })

// todos.container.addEventListener('dragenter', (e) => {
//     e.preventDefault()
//     todos.container.classList.add('bg-fuchsia-400')
// })

// todos.container.addEventListener('dragover', (e) => {
//     e.preventDefault()
//     todos.container.classList.add('bg-fuchsia-400')
// })

// todos.container.addEventListener('dragleave', (e) => {
//     e.preventDefault()
//     todos.container.classList.remove('bg-fuchsia-400')
// })

// todos.container.addEventListener('drop', (e) => {
//     e.preventDefault()
//     todos.container.classList.remove('bg-fuchsia-400')

//     const data = e.dataTransfer.getData('text/plain')

//     if (originalContainer == todos.container) {
//         return
//     }

//     const dropped = document.querySelector(`[data-id="${data}"]`)

//     const heading = dropped.firstElementChild
//     heading.classList.remove('bg-teal-600')
//     heading.classList.add('bg-violet-700')

//     const rightButtons = dropped.lastElementChild.lastElementChild
//     const undoneButton = rightButtons.firstElementChild
//     undoneButton.remove()
//     const doneButton = createButton('bg-violet-700', '<i class="fa-solid fa-check"></i>', function () {
//         todos.markAsDone(data)
//     }, 'done-button', 'Mark as done')
//     rightButtons.append(doneButton)

//     const separator = createSeparator('bg-violet-200')

//     todos.container.append(separator, dropped)

//     dones.dragAsUndone(data)
// })

// dones.container.addEventListener('dragenter', (e) => {
//     e.preventDefault()
//     dones.container.classList.add('bg-teal-300')
// })

// dones.container.addEventListener('dragover', (e) => {
//     e.preventDefault()
//     dones.container.classList.add('bg-teal-300')
// })

// dones.container.addEventListener('dragleave', (e) => {
//     e.preventDefault()
//     dones.container.classList.remove('bg-teal-300')
// })

// dones.container.addEventListener('drop', (e) => {
//     e.preventDefault()
//     dones.container.classList.remove('bg-teal-300')

//     const data = e.dataTransfer.getData('text/plain')

//     if (originalContainer == dones.container) {
//         return
//     }

//     const dropped = document.querySelector(`[data-id="${data}"]`)

//     const heading = dropped.firstElementChild
//     heading.classList.remove('bg-violet-700')
//     heading.classList.add('bg-teal-600')

//     const rightButtons = dropped.lastElementChild.lastElementChild
//     const doneButton = rightButtons.firstElementChild
//     doneButton.remove()
//     const undoneButton = createButton('bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', function () {
//         dones.markAsUndone(data)
//     }, 'undone-button', 'Mark as undone')
//     rightButtons.append(undoneButton)

//     const separator = createSeparator('bg-teal-200')

//     dones.container.append(separator, dropped)

//     todos.dragAsDone(data)
// })

// // Closing modal if clicked outside
// document.addEventListener('click', (e) => {
//     const menuClicked = menu.menu.contains(e.target) || menu.showMenuButton.contains(e.target)
//     if (!menuClicked) {
//         menu.closeMenu()
//     }


//     const projectDropdownClicked = projects.dropdown.contains(e.target) || projects.optionsContainer.contains(e.target)
//     if (!projectDropdownClicked) {
//         projects.closeOptions();
//     }

//     const todosGetStartedButton = document.getElementById('home-todos-get-started')
//     let addTodoModalClicked = todos.addTodoModal.firstElementChild.contains(e.target) || todos.addTodoShowButton.contains(e.target)
//     if (todosGetStartedButton) {
//         addTodoModalClicked = todos.addTodoModal.firstElementChild.contains(e.target) || todos.addTodoShowButton.contains(e.target) || todosGetStartedButton.contains(e.target)
//     }
//     if (!addTodoModalClicked) {
//         todos.closeAddTodo()
//     }

//     // const editTodoModalClicked = todos.editTodoModal.firstElementChild.contains(e.target) || Array.from(editTodoButtons).some((edit) => edit.contains(e.target))
//     // console.log(editTodoModalClicked)
//     // if (!editTodoModalClicked) {
//     //     todos.closeEditTodo()
//     // }

//     const projectsGetStartedButton = document.getElementById('home-projects-get-started')
//     let addProjectClicked = projects.addProject.firstElementChild.contains(e.target) || projects.addProjectShowButton.contains(e.target)
//     if (projectsGetStartedButton) {
//         addProjectClicked = projects.addProject.firstElementChild.contains(e.target) || projects.addProjectShowButton.contains(e.target) || projectsGetStartedButton.contains(e.target)
//     }
//     if (!addProjectClicked) {
//         projects.closeAddProject()
//     }
// });

// // Footer
// const footer = document.getElementById('footer')
// if (footer.hasChildNodes) {
//     footer.classList.add('mt-8')
// }

// setInterval(setClock, 1000)
// showYear()
// // }