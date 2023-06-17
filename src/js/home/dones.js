import fetchData from '../components/data'
import makeCard from '../components/card'
import createEmptyState from '../components/empty'

class Dones {
    constructor() {
        this.name = 'dones'

        this.container = document.getElementById('home-dones-container')
        this.heading = document.getElementById('home-dones-heading')
    }

    async getData(user_id) {
        return await fetchData(`/api/users/${user_id}/dones`)
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
                separator.classList.add('w-full', 'h-px', 'bg-teal-200')

                this.container.append(separator, card)
            }

            return data
        } catch (err) {
            console.error(err)
        }
    }

    filterByProjects(dones, projectId) {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild)
        }

        this.container.appendChild(this.heading)

        const filtered = dones.filter((done) => {
            return done.project_id === parseInt(projectId)
        })

        for (let i = 0; i < filtered.length; i++) {
            const title = JSON.stringify(filtered[i].title).split('"').join('')
            const project = JSON.stringify(filtered[i].project_title).split('"').join('')
            const description = JSON.stringify(filtered[i].description).split('"').join('')

            const card = makeCard(title, project, description)

            const separator = document.createElement('span')
            separator.classList.add('w-full', 'h-px', 'bg-teal-200')

            this.container.append(separator, card)
        }
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)

        const separator = document.createElement('span')
        separator.classList.add('w-full', 'h-px', 'bg-teal-200')

        this.container.append(separator, emptyBox)

        return emptyBox
    }
}

export default Dones