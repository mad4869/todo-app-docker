import { fetchData, updateData } from "../components/data"

class User {
    constructor(user) {
        this.user = user
        this.profile = {
            profile: document.getElementById('profile-user'),
            fields: {
                name: document.getElementById('profile-user-name'),
                role: document.getElementById('profile-user-role'),
                bio: document.getElementById('profile-user-bio')
            },
            update: document.getElementById('profile-user-update')
        }

        this.tasks = {
            total: document.getElementById('profile-tasks-total'),
            onProgress: document.getElementById('profile-tasks-onprogress'),
            done: document.getElementById('profile-tasks-done')
        }
    }

    attachEventListeners = () => {
        this.profile.profile.addEventListener('focus', (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.profile.update.classList.remove('hidden')
            }
        }, true)

        this.profile.update.addEventListener('click', () => {
            this.updateProfile()
        })
    }

    getProfile = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}`)

            this.profile.fields.name.textContent = data.name
            this.profile.fields.role.textContent = data.role
            if (data.bio) {
                this.profile.fields.bio.textContent = data.bio
            } else {
                this.profile.fields.bio.textContent = 'Describe yourself here...'
            }
        } catch (err) {
            console.error(err)
        }
    }

    updateProfile = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}`)
            const updatedData = {
                ...data,
                name: this.profile.fields.name.textContent,
                role: this.profile.fields.role.textContent,
                bio: this.profile.fields.bio.textContent
            }

            const { success } = await updateData(`/api/users/${this.user}`, JSON.stringify(updatedData))
            if (success) {
                location.reload()
            }
        } catch (err) {
            console.error(err)
        }
    }

    getTasksDetails = async () => {
        try {
            const todoTasks = await fetchData(`/api/users/${this.user}/todos`)
            const doneTasks = await fetchData(`/api/users/${this.user}/dones`)

            this.tasks.total.textContent = todoTasks['data'].length + doneTasks['data'].length
            this.tasks.onProgress.textContent = todoTasks['data'].length
            this.tasks.done.textContent = doneTasks['data'].length
        } catch (err) {
            console.error(err)
        }
    }
}

export default User