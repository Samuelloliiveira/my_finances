//os valores do input guardados em array
const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    },
]

const CalculateTransactions = {
    incomes() {
        let income = 0;
        
        transactions.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })

        return income
    },

    expenses() {
        let expense = 0;

        transactions.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }            
        })

        return expense
    },

    total() {
        return CalculateTransactions.incomes() + CalculateTransactions.expenses()
    }
}

//Popular HTML com os dados do array
const DOM = {

    //buscando o tbody da tabela no html e colocando em um atributo
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction) 

        DOM.transactionsContainer.appendChild(tr)
    },

    //modelo html
    innerHTMLTransaction(transaction) {

        const CSSclasses = transaction.amount > 0 ? "income" : "expense" //if ternario

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
            <td>
                <img onclick="modal.openCloseModal()" class="editcircle" src="./assets/editcircle_120035.svg" alt="editar transação">
            </td>
        `

        return html
    },

    //exibindo as somas no balance
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(CalculateTransactions.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(CalculateTransactions.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(CalculateTransactions.total())

    }
}

//formatando o valor(amount)
const Utils = {
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

//Pegando todas as transações
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})

DOM.updateBalance()