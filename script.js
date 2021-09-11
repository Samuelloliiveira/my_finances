const Modal = { //objeto modal
    openCloseModal() {//metodo 
        const activeModal = document.querySelector('.modal-overlay')
        activeModal.classList.toggle('active')
    },

    removeAlert() {

        const alert = document.querySelector('.input-group.alert')

        /*para cara elemento error que tiver dentro de alert
        ele vai remover*/
        for (error of alert.children) {
            error.remove();
        }
    },
}

const Storage = {
    get() {
        //string para array ou objeto
        //retorna os valores ou um array vazio
        return JSON.parse(localStorage.getItem("my.finances:transactions")) || []
    },

    //Setando todas as transações para localstorage como string
    set(transactions) {
        localStorage.setItem("my.finances:transactions",
            JSON.stringify(transactions))
    }
}

const Transaction = {

    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    //Calculo das trasações
    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })

        return income
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })

        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

//Popular HTML com os dados do array
const DOM = {

    //buscando o tbody da tabela no html e colocando em um atributo
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    //modelo html
    innerHTMLTransaction(transaction, index) {

        const CSSclasses = transaction.amount > 0 ? "income" : "expense" //if ternario

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
            <td>
                <img onclick="EditValues.ModalEditValue()" class="editcircle" src="./assets/editcircle_120035.svg" alt="editar transação">
            </td>
        `

        return html
    },

    //exibindo as somas no balance
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

//formatando o valor(amount)
const Utils = {

    formatAmount(value) {

        value = value * 100
        return Math.round(value)

    },

    formatDate(date) {
        const splittedDate = date.split('-')

        //template literals
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        //na expressão regular abaixo ele pega tudo que não é número e troca por alguma coisa
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value;
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()//Desestruturando os valores

        if (
            description.trim() === '' ||
            amount.trim() === '' ||
            date.trim() === '') {
            throw new Error('Preencha todos os campos')
        }

    },

    formatValues() {
        let { description, amount, date } = Form.getValues()//Desestruturando os valores

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)


        return {
            description,
            amount,
            date,
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {//evento de submeter o formulário
        event.preventDefault()//não passa valores pela url(http)

        try {

            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)//salvar a transação
            Form.clearFields()
            Modal.openCloseModal()

        } catch (error) {
            //Pegando elemento pai
            const inputGroupAlert = document.querySelector('.input-group.alert')

            //se tiver algum filho dentro da div ele não executa
            if (!inputGroupAlert.firstChild) {

                //criando um elemento p filho
                const p = document.createElement('p')
                p.innerHTML = error.message //passando erro

                inputGroupAlert.appendChild(p)//colocando p dentro do elemento pai
            }


            //Chama a função de remover alerta depois de um tempo
            setTimeout(function () {
                Modal.removeAlert()
            }, 1100)
        }
    }
}

//  AQUI EU VOU EDITAR OS DADOS
const EditValues = {

    reversingDateFormatting() {  

        //Desfazer a formatação de data
        const previousDate = EditValues.getValueStorage()[2].split('/')

        return `${previousDate[2]}-${previousDate[1]}-${previousDate[0]}`
    },

    SaveNewValues() {
        //Salvar as informações que estão no formulário
        //Corrigir erro que mostra que esta vázio
        //Substituir as informações do Storate usando SET()
        //Pegar o index da trasação que deseja editar
        //Mostar na tela novas informações
    },

    ModalEditValue(value) {
        //colocando novos valores dentro do Modal
        const addNewModal = document.querySelector('#addNewModal')
        addNewModal.innerHTML = EditValues.innerHTMLModal(value)

        EditValues.reversingDateFormatting()

        Modal.openCloseModal()

    },

    innerHTMLModal() {

        const htmlModal = `
            <div class="input-group alert"></div>

            <div class="input-group">
                <label class="sr-only" for="description">Descrição</label>
                <input type="text" name="description" id="description" placeholder="Descrição" value="${EditValues.getValueStorage()[0]}">
            </div>

            <div class="input-group">
                <label class="sr-only" for="amount">Valor</label>
                <input type="number" name="amount" id="amount" step="0.01" placeholder="0,00" value="${EditValues.getValueStorage()[1]}">

                <small>Use o sinal -(negativo) para despesas e ,(virgula) para casas decimais</small>
            </div>

            <div class="input-group">
                <label class="sr-only" for="date">Data</label>
                <input type="date" name="date" id="date" value="${EditValues.reversingDateFormatting()}">
            </div>

            <div class="input-group actions">
                <a onclick="Modal.openCloseModal()" href="#" class="button cancel">Cancelar</a>
                <button>Salvar</button>
            </div>
        `

        return htmlModal
    },

    getValueStorage(index = 0) { //PASSAR O INDECE PARA PEGAR DE STORAGE.GET

        //pegando os dados do local storage
        const storedData = Storage.get()

        //desestruturação do array pegando pegando o index do array
        const { description, amount, date } = storedData[index]

        const ArrayValue = [description, amount, date] //criando array com as informações

        return ArrayValue
            
    },
}

const App = {
    init() {
        //Pegando todas as transações
        Transaction.all.forEach(DOM.addTransaction)//passando addTransaction como um atalho

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {

        DOM.clearTransactions()

        App.init()
    }
}

App.init()

//OS DADOS DESSA APLICAÇÃO ESTÁO SALVOS EM LOCAL STORAGE                