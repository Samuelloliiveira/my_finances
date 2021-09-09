const modal = {
    open() {
        const activeModal = document.querySelector('.modal-overlay')
        activeModal.classList.add('active')
    },

    close() {
        const removeModal = document.querySelector('.modal-overlay')
        removeModal.classList.remove('active')
    }
}