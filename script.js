const modal = {
    open() {
        const openModal = document.querySelector('.modal-overlay')
        openModal.classList.add('active')
    },

    close() {
        const closeModal = document.querySelector('.modal-overlay')
        closeModal.classList.remove('active')
    }
}