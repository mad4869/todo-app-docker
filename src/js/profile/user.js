import fetchData, { updateData } from "../components/data"

class User {
    constructor() {
        this.profile = document.getElementById('profile-user')
        this.name = document.getElementById('profile-user-name')
        this.role = document.getElementById('profile-user-role')
        this.bio = document.getElementById('profile-user-bio')
        this.update = document.getElementById('profile-user-update')

        this.tasksTotal = document.getElementById('profile-tasks-total')
        this.tasksOnprogress = document.getElementById('profile-tasks-onprogress')
        this.tasksDone = document.getElementById('profile-tasks-done')
    }

    async getUserData(user_id) {
        return await fetchData(`/api/users/${user_id}`)
    }

    async getTodosData(user_id) {
        return await fetchData(`/api/users/${user_id}/todos`)
    }

    async getDonesData(user_id) {
        return await fetchData(`/api/users/${user_id}/dones`)
    }

    async getProfile(user_id) {
        try {
            const data = await this.getUserData(user_id)

            this.name.textContent = data.name
            this.role.textContent = data.role
            if (data.bio) {
                this.bio.textContent = data.bio
            } else {
                this.bio.textContent = 'Describe yourself...'
            }
        } catch (err) {
            console.error(err)
        }
    }

    async updateProfile(user_id) {
        try {
            const data = await fetchData(`/api/users/${user_id}`)
            data.name = this.name.textContent
            data.role = this.role.textContent
            data.bio = this.bio.textContent

            const updatedData = await updateData(`/api/users/${user_id}`, data)
            if (updatedData) {
                location.reload()
            }
        } catch (err) {
            console.error(err)
        }
    }

    async getTasksStats(user_id) {
        try {
            const onprogressTasks = await this.getTodosData(user_id)
            const doneTasks = await this.getDonesData(user_id)

            this.tasksTotal.textContent = onprogressTasks.length + doneTasks.length
            this.tasksOnprogress.textContent = onprogressTasks.length
            this.tasksDone.textContent = doneTasks.length
        } catch (err) {
            console.error(err)
        }
    }
}

export default User