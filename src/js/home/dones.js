import emptyState from '../components/empty'

class Dones {
    constructor() {
        this.name = 'dones'

        this.container = document.getElementById('home-dones-container')
    }

    createEmptyState() {
        const container = emptyState(this.name)

        const separator = document.createElement('span')
        separator.className = 'w-full h-px bg-teal-200'

        this.container.append(this.separator, container)
    }
}

export default Dones