const modal = { //objeto modal
    openCloseModal() {//metodo 
        const activeModal = document.querySelector('.modal-overlay')
        activeModal.classList.toggle('active')
    }
}