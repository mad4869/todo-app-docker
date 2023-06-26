class Menu {
    constructor() {
        this.menu = document.getElementById('home-menu')
        this.show = document.getElementById('home-show-menu-button')
    }

    attachEventListeners = () => {
        this.show.addEventListener('click', () => {
            this.showMenu()
        })
    }

    showMenu() {
        this.menu.classList.remove('translate-y-full')
        this.menu.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    closeMenu() {
        this.menu.classList.add('translate-y-full')
        this.menu.classList.remove('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }
}

export default Menu