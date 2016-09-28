import Vue from 'vue';
import Chart from 'chart.js';
import creditCardInput from '../components/credit-card-input.jsx';
import savingsInput from '../components/savings-input.jsx';
import { calculateSavingsInAYear } from './utils/savings-utils';
import { calculateRepayments } from './utils/debt-utils';

const viewState = {
    billFormData: {
        debt: 0,
        rate: 0,
        repay: 0
    },
    savingsFormData: {
        savings: 0,
        rate: 0,
        payment: 0
    },
    creditRepayment: {},
    savingsAmount: {},
    editMode: false
};

const userData = {
    income: 0,
    incomeFrequency: 'Weekly',
    debts: [
        {
            name: 'New Debit',
            type: 'Bill',
            value: 0
        }
    ]
};

const availableTypes = [
    'Bill',
    'Savings'
];

const frequencyOptions = {
    weekly: 52,
    biWeekly: 26,
    monthly: 12,
    quarterly: 3,
};

function handleCreditCardDebtCalculation(event) {
    event.preventDefault();
    const debt = parseInt(viewState.billFormData.debt) * 100;
    const repayment = parseInt(viewState.billFormData.repay) * 100;
    const rate = parseInt(viewState.billFormData.rate) / 100;
    viewState.creditRepayment = calculateRepayments(debt, repayment, rate);
    const creditChart = new Chart(document.getElementById('credit_chart'), {
        type: 'line',
        data: {
            labels: Object.keys(viewState.creditRepayment),
            datasets: [{
                label: 'Amount Remaining',
                data: Object.values(viewState.creditRepayment).map(function(item) {
                    return parseInt(item) / 100;
                })
            }],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        }
    })
}

function handleSavingsCalculation(event) {
    event.preventDefault();
    const savings = parseInt(viewState.savingsFormData.savings) * 100;
    const payment = parseInt(viewState.savingsFormData.payment) * 100;
    const rate = parseInt(viewState.savingsFormData.rate) / 100;
    viewState.savingsAmount = calculateSavingsInAYear(savings, payment, rate);
    const savingsCart = new Chart(document.getElementById('savings_chart'), {
        type: 'line',
        data: {
            labels: Object.keys(viewState.savingsAmount),
            datasets: [{
                label: 'Amount Saved',
                data: Object.values(viewState.savingsAmount).map(function(item) {
                    return parseInt(item) / 100;
                })
            }],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        }
    })
}

function handleDebtFormChanged(whichInput, event) {
    viewState.billFormData[whichInput] = event.target.value;
}

function handleSavingsFormChanged(whichInput, event) {
    viewState.savingsFormData[whichInput] = event.target.value;
}

function handleDebitChanged(item, index, event) {
    const hyphenPosition = event.target.name.indexOf('-');
    const whichValue = event.target.name.slice(0, hyphenPosition);
    userData.debts[index] = {
        ...userData.debts[index],
        [whichValue]: event.target.value
    };
}

function handleAddDebitClicked() {
    userData.debts.push({
        name: 'New Debit',
        type: 'Bill',
        value: 0
    });
}

function handleEditModeButtonPressed() {
    viewState.editMode = !viewState.editMode;
    pageView.$data.editMode = viewState.editMode;
}

function handleDeleteButtonPressed(billClickedIndex) {
    console.log(billClickedIndex);
    userData.debts = userData.debts.filter((item, index) => {
        return billClickedIndex !== index;
    });
    pageView.$data.debts = userData.debts;
}

function renderBillInputs(h, bill, index) {
    return (
        <div>
            <button on-click={handleDeleteButtonPressed.bind(this, index)}>&times;</button>
            <input type="text" name={`name-${index}`} on-change={handleDebitChanged.bind(this, bill, index)} value={bill.name}/>
            <input type="text" name={`value-${index}`} on-change={handleDebitChanged.bind(this, bill, index)} value={bill.value}/>
            <select type="text" name={`type-${index}`} on-change={handleDebitChanged.bind(this, bill, index)} selected={bill.type}>
                {
                    availableTypes.map((type) => {
                        return <option value={type}>{type}</option>;
                    })
                }
            </select>
        </div>
    )
}

function renderReadBill(h, bill, index) {
    return (
        <div>
            <span name={`name-${index}`}>
                {bill.name}
            </span>
            <span name={`value-${index}`}>
                {bill.value}
            </span>
            <span name={`type-${index}`}>
                {bill.type}
            </span>
        </div>
    )
}

if (process.NODE_ENV !== 'production') {
    window.zz = viewState;
    window.qq = userData;
}

Vue.component('credit-card-input', creditCardInput);
Vue.component('savings-input', savingsInput);

const pageView = new Vue({
    el: '#root',
    data: {
        debts: userData.debts,
        editMode: viewState.editMode
    },
    methods: {
        handleDebitChanged,
        handleCreditCardDebtCalculation,
        handleSavingsCalculation
    },
    render () {
        console.log(this);
        const h = this.$createElement;
        return (
            <div>
                <button on-click={handleEditModeButtonPressed}>Edit Mode</button>
                {
                    this.$data.editMode
                    ?
                        <div>
                            { this.$data.debts.map((item, index) => {
                                return renderBillInputs(h, item, index);
                            }) }
                            <button on-click={handleAddDebitClicked}>Add Debit</button>
                        </div>
                    :
                        this.$data.debts.map((item, index) => {
                            return renderReadBill(h, item, index);
                        })
                }
                <credit-card-input
                    debt={viewState.billFormData.debt}
                    repay={viewState.billFormData.repay}
                    rate={viewState.billFormData.rate}
                    handle-form-submit={handleCreditCardDebtCalculation}
                    handle-input-changed={handleDebtFormChanged}
                />
                <canvas id="credit_chart" width="400" height="400"/>
                <savings-input
                    initial-savings={viewState.savingsFormData.savings}
                    saving={viewState.savingsFormData.payment}
                    rate={viewState.savingsFormData.rate}
                    handle-form-submit={handleSavingsCalculation}
                    handle-input-changed={handleSavingsFormChanged}
                />
                <canvas id="savings_chart" width="400" height="400"/>
            </div>
        )
    }
});

