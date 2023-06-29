class Menu {
    constructor() {
        this.menu = document.getElementById('home-menu')
        this.show = document.getElementById('home-show-menu-button')
    }

    attachHandlers = () => {
        this.handleShowMenu()
        this.handleClickOutside()
    }

    showMenu() {
        this.menu.classList.remove('translate-y-full')
        this.menu.classList.add('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    handleShowMenu = () => {
        this.show.addEventListener('click', () => {
            this.showMenu()
        })
    }

    closeMenu() {
        this.menu.classList.add('translate-y-full')
        this.menu.classList.remove('shadow-[0px_0px_0px_9999px_rgba(0,0,0,0.7)]')
    }

    handleClickOutside = () => {
        document.addEventListener('click', (e) => {
            if (this.menu) {
                const menuClicked = this.menu.contains(e.target) || this.show.contains(e.target)
                if (! menuClicked) {
                    this.closeMenu()
                }
            }
        })
    }
}

export default Menu
