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

const addTaskModal = document.getElementById('add-task')
const editTask = document.getElementById('edit-task')
const deleteTask = document.getElementById('delete-task')

// const box = document.getElementById('box')

const showButton = document.getElementById('show-button')
showButton.addEventListener('click', function () {
    addTaskModal.show()
    // document.addEventListener('click', outsideClickHandler)
})

// const outsideClickHandler = (event) => {
//     if (!box.contains(event.target)) {
//         addTask.close()
//         document.removeEventListener('click', outsideClickHandler)
//     }
// }

const editModalButton = document.getElementById('edit-button')
editModalButton.addEventListener('click', function () {
    editTask.show()
})

const deleteModalButton = document.getElementById('delete-button')
deleteModalButton.addEventListener('click', function () {
    deleteTask.show()
})

const closeButton = document.getElementById('close-button')
closeButton.addEventListener('click', function () {
    addTaskModal.close()
})

const closeEdit = document.getElementById('close-edit')
closeEdit.addEventListener('click', function () {
    editTask.close()
})

const closeDelete = document.getElementById('close-delete')
closeDelete.addEventListener('click', function () {
    deleteTask.close()
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