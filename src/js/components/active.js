const active = (url) => {
    const link = document.querySelector(`a[href="${url}"]`)
    link.classList.add('text-teal-400')
}

export default active