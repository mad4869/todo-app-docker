import './style.css'

import Lottie from 'lottie-web';

const backgroundContainer = document.getElementById('background-container')
const loadingContainer = document.getElementById('loading-container')
const backgroundData = require('./background.json')
const loadingData = require('./loading.json')
Lottie.loadAnimation({
    container: backgroundContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: backgroundData
})
Lottie.loadAnimation({
    container: loadingContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: loadingData
})

const setClock = () => {
    const date = new Date()
    const clock = document.getElementById('clock')
    if (clock) {
        clock.innerHTML = date.toLocaleTimeString([], { hour12: false })
    }
}

setInterval(setClock, 1000)

const showYear = () => {
    const year = document.getElementById('year')
    if (year) {
        year.innerHTML = new Date().getFullYear()
    }
}

window.onload = showYear

let isDropdownProjectItemsVisible = false
let isModalVisible = false

const dropdownProject = document.getElementById('dropdown-project')
const dropdownProjectItems = document.getElementById('dropdown-project-items')
dropdownProject.addEventListener('click', function () {
    dropdownProjectItems.classList.remove('invisible')
    dropdownProjectItems.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    isDropdownProjectItemsVisible = true
})

const addTaskModal = document.getElementById('add-task')
const editTaskModal = document.getElementById('edit-task')
const deleteTaskModal = document.getElementById('delete-task')
const addProjectModal = document.getElementById('add-project')
const addModal = document.querySelector('#add-task > div')

const showAddOptions = document.getElementById('show-add-options')
let isAddOptionsVisible = false;

const addOptions = document.getElementById('add-options')
showAddOptions.addEventListener('click', function () {
    addOptions.classList.remove('translate-y-full')
    addOptions.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    isAddOptionsVisible = true
})

const showButton = document.getElementById('show-button')
showButton.addEventListener('click', function () {
    addTaskModal.show()
    addOptions.classList.add('translate-y-full')
    addOptions.classList.remove('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    isModalVisible = true
})

document.addEventListener('click', function (event) {
    if (isAddOptionsVisible && !addOptions.contains(event.target) && event.target !== showAddOptions) {
        addOptions.classList.add('translate-y-full');
        addOptions.classList.remove('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]');
        isAddOptionsVisible = false
    } else if (isDropdownProjectItemsVisible && !dropdownProjectItems.contains(event.target) && event.target !== dropdownProject) {
        dropdownProjectItems.classList.add('invisible')
        isDropdownProjectItemsVisible = false
    } else if (isModalVisible && !addModal.contains(event.target) && event.target !== showButton) {
        console.log('Woah')
        // addTaskModal.close()
        // isModalVisible = false
    } else {
        return
    }
}
);

const showAddProject = document.getElementById('show-add-project')
showAddProject.addEventListener('click', function () {
    addProjectModal.show()
    addOptions.classList.add('translate-y-full')
    addOptions.classList.remove('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
})

const titleOne = document.getElementById('title-1')
const descOne = document.getElementById('desc-1')
const proA = document.getElementById('pro-a')

const editTaskForm = document.getElementById('edit-task-form')
const editModalButton = document.getElementById('edit-button')
editModalButton.addEventListener('click', function () {
    editTaskModal.show()

    editTaskForm.elements['project'].value = proA.innerHTML
    editTaskForm.elements['title'].value = titleOne.innerHTML
    editTaskForm.elements['description'].value = descOne.innerHTML
})

const deleteModalButton = document.getElementById('delete-button')
deleteModalButton.addEventListener('click', function () {
    deleteTaskModal.show()

    const deletedTask = document.getElementById('deleted-task')
    deletedTask.innerHTML = titleOne.innerHTML
})

const closeButton = document.getElementById('close-button')
closeButton.addEventListener('click', function () {
    addTaskModal.close()
})

const closeEdit = document.getElementById('close-edit')
closeEdit.addEventListener('click', function () {
    editTaskModal.close()
})

const closeDelete = document.getElementById('close-delete')
closeDelete.addEventListener('click', function () {
    deleteTaskModal.close()
})

const closeProject = document.getElementById('close-project')
closeProject.addEventListener('click', function () {
    addProjectModal.close()
})

const addProjectSubmit = document.getElementById('add-project-submit')
addProjectSubmit.addEventListener('click', function (e) {
    e.preventDefault()

    const addProjectForm = document.getElementById('add-project-form')

    addProjectForm.reset()
    addProjectModal.close()
})

const addTaskSubmit = document.getElementById('add-task-submit')
addTaskSubmit.addEventListener('click', function (e) {
    e.preventDefault()

    const addTaskForm = document.getElementById('add-task-form')
    const project = addTaskForm.elements['project'].value
    const title = addTaskForm.elements['title'].value
    const description = addTaskForm.elements['description'].value

    const todoContainer = document.createElement('div')
    todoContainer.className = 'w-full pb-2 border border-solid border-violet-700 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.3)] overflow-hidden'

    const todoHeading = document.createElement('div')
    todoHeading.className = 'flex justify-between items-center px-4 py-2 bg-violet-700'

    const todoTitle = document.createElement('h1')
    todoTitle.className = 'flex-1 text-xl text-white font-semibold'
    todoTitle.innerHTML = title

    const todoProjectContainer = document.createElement('span')
    todoProjectContainer.className = 'px-2 py-1 border border-solid border-white rounded-full'
    const todoProject = document.createElement('h3')
    todoProject.className = 'text-white text-sm'
    todoProject.innerHTML = project
    todoProjectContainer.appendChild(todoProject)

    todoHeading.append(todoTitle, todoProjectContainer)

    const todoDescription = document.createElement('div')
    todoDescription.className = 'px-4 py-2'

    const todoDescriptionContent = document.createElement('p')
    todoDescriptionContent.className = 'text-xs'
    todoDescriptionContent.innerHTML = description
    todoDescription.appendChild(todoDescriptionContent)

    const todosContainer = document.getElementById('todos-container')

    const separator = document.createElement('span')
    separator.className = 'w-full h-px bg-violet-200'

    const buttonsContainer = document.createElement('div')
    buttonsContainer.className = 'flex justify-between px-4'

    const leftButtons = document.createElement('span')
    const rightButtons = document.createElement('span')

    const editButton = document.createElement('button')
    editButton.className = 'mr-1 px-2 py-px bg-teal-500 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
    editButton.innerHTML = 'Edit'
    const deleteButton = document.createElement('button')
    deleteButton.className = 'px-2 py-px bg-rose-600 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
    deleteButton.innerHTML = 'Delete'
    const doneButton = document.createElement('button')
    doneButton.className = 'px-4 py-px bg-violet-700 text-xs text-white rounded-lg shadow-[1px_1px_1px_rgba(0,0,0,0.3)]'
    doneButton.setAttribute('title', 'Mark as done')
    doneButton.innerHTML = '<i class="fa-solid fa-check"></i>'

    leftButtons.append(editButton, deleteButton)
    rightButtons.appendChild(doneButton)
    buttonsContainer.append(leftButtons, rightButtons)

    todoContainer.append(todoHeading, todoDescription, buttonsContainer)

    todosContainer.append(separator, todoContainer)

    addTaskForm.reset()
    addTaskModal.close()
})

const editTaskSubmit = document.getElementById('edit-task-submit')
editTaskSubmit.addEventListener('click', function (e) {
    e.preventDefault()

    titleOne.innerHTML = editTaskForm.elements['title'].value
    descOne.innerHTML = editTaskForm.elements['description'].value
    proA.innerHTML = editTaskForm.elements['project'].value

    editTaskModal.close()
})

const deleteBtn = document.getElementById('delete')
const cancelBtn = document.getElementById('cancel')
deleteBtn.addEventListener('click', function (e) {
    e.preventDefault()

    const todosContainer = document.getElementById('todos-container')
    const todoOne = document.getElementById('todo-1')
    todosContainer.removeChild(todoOne.previousElementSibling)
    todosContainer.removeChild(todoOne)

    deleteTaskModal.close()
})
cancelBtn.addEventListener('click', function (e) {
    e.preventDefault()

    deleteTaskModal.close()
})
// document.addEventListener('DOMContentLoaded', function () {
//     function updateProgressBar() {
//         const progressBar = document.querySelector('.progress')
//         const progress = Math.floor((performance.now() / 3000) * 100)
//         progressBar.style.width = progress + '%'
//     }
//     function hideWelcomeScreen() {
//         const welcome = document.getElementById('welcome')
//         welcome.style.display = 'none'
//         const homepage = document.getElementById('homepage')
//         homepage.style.display = 'block'
//     }
//     window.onload = function () {
//         updateProgressBar()
//         setTimeout(hideWelcomeScreen, 3000)
//     }
// })