import createEmptyState from '../components/empty'

class Dones {
    constructor() {
        this.name = 'dones'

        this.donesContainer = document.getElementById('home-dones-container')

        this.separator = document.createElement('span')
    }

    emptyState() {
        const container = createEmptyState(this.name)

        this.separator.className = 'w-full h-px bg-teal-200'
        this.donesContainer.append(this.separator, container)
    }
}

export default Dones