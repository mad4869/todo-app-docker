import { fetchData, updateData } from "../components/data"
import loadAnimation from "../components/animation"
import showNotice from "../components/notice"

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

        this.loading = document.getElementById('profile-loading')
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

            return data
        } catch (err) {
            console.error(err)
        }
    }

    handleShowUpdate = () => {
        this.showUpdate = (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.profile.update.classList.remove('hidden')
            }
        }

        this.profile.profile.addEventListener('focus', this.showUpdate, true)
    }

    handleHideUpdate = () => {
        this.hideUpdate = (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.profile.update.classList.add('hidden')
            }
        }

        this.profile.profile.addEventListener('blur', this.hideUpdate, true)
    }

    handleHoverUpdate = () => {
        this.profile.update.addEventListener('mouseenter', () => {
            this.profile.profile.removeEventListener('blur', this.hideUpdate, true)
        })
        this.profile.update.addEventListener('mouseover', () => {
            this.profile.profile.removeEventListener('blur', this.hideUpdate, true)
        })
        this.profile.update.addEventListener('mouseleave', () => {
            this.profile.profile.addEventListener('blur', this.hideUpdate, true)
        })
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

            const res = await updateData(`/api/users/${this.user}`, JSON.stringify(updatedData))

            return res
        } catch (err) {
            console.error(err)
        }
    }

    handleUpdateProfile = () => {
        this.profile.update.addEventListener('click', async () => {
            this.profile.update.innerHTML = ''
            loadAnimation(this.profile.update, 'dots-white')

            try {
                const res = await this.updateProfile()
                if (res.success) {
                    location.reload()
                } else {
                    this.profile.update.innerHTML = 'update profile'

                    showNotice(res.message, 'error')
                }
            } catch (err) {
                console.error(err)
            }
        })
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

    handleProfile = async () => {
        loadAnimation(this.loading, 'loading')

        try {
            const profile = await this.getProfile()
            if (profile) {
                this.loading.classList.add('hidden')

                this.handleShowUpdate()
                this.handleHideUpdate()
                this.handleHoverUpdate()
                this.handleUpdateProfile()

                this.getTasksDetails()
            } else {
                this.loading.classList.add('hidden')
                showNotice('Failed to load your profile', 'error')
            }
        } catch (err) {
            console.error(err)
        }
    }
}

export default User