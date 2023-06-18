import fetchData from "../components/data"

class User {
    constructor() {
        this.name = document.getElementById('profile-user-name')
        this.role = document.getElementById('profile-user-role')
        this.bio = document.getElementById('profile-user-bio')

        this.tasksTotal = document.getElementById('profile-tasks-total')
        this.tasksOnprogress = document.getElementById('profile-tasks-onprogress')
        this.tasksDone = document.getElementById('profile-tasks-done')
    }

    async getUserData(user_id) {
        return await fetchData(`/api/users/${user_id}`)
    }

    async getTasksData(user_id) {
        return await fetchData(`/api/users/${user_id}/todos`)
    }

    async getProfile(user_id) {
        try {
            const data = await this.getUserData(user_id)

            this.name.textContent = data.name
            this.role.textContent = data.role
            if (data.bio) {
                this.bio.textContent = data.bio
            } else {
                this.bio.textContent = 'Tell the world about yourself!'
            }
        } catch (err) {
            console.error(err)
        }
    }

    async getTasksStats(user_id) {
        try {
            const allTasks = await this.getTasksData(user_id)
            const onprogressTasks = allTasks.filter((task) => task.is_done == false)
            const doneTasks = allTasks.filter((task) => task.is_done == true)

            this.tasksTotal.textContent = allTasks.length
            this.tasksOnprogress.textContent = onprogressTasks.length
            this.tasksDone.textContent = doneTasks.length
        } catch (err) {
            console.error(err)
        }
    }
}

export default User