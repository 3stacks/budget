// Dependencies
import Vue from 'vue';
import Chart from 'chart.js';
import * as localStorageManager from '@lukeboyle/local-storage-manager';
// Components
import creditCardInput from './components/credit-card-input.jsx';
import savingsInput from './components/savings-input.jsx';
import bill from './components/bill.jsx';
import inputIncome from './components/input-income.jsx';
// Functions
import { calculateSavingsInAYear } from './utils/savings-utils';
import { calculateRepayments } from './utils/debt-utils';
// Constants
import frequencyOptions from './constants/frequency';

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
    income: localStorageManager.get('userIncome') || 0,
    incomeFrequency: 'Weekly',
    debts: localStorageManager.get('userDebts') || [
        {
            name: 'New Debit',
            type: 'Bill',
            value: 0
        }
    ],
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
    localStorageManager.set('userDebts', userData.debts);
}

function handleAddDebitClicked() {
    userData.debts.push({
        name: 'New Debit',
        type: 'Bill',
        value: 0
    });
    localStorageManager.set('userDebts', userData.debts);
}

function handleEditModeButtonPressed() {
    viewState.editMode = !viewState.editMode;
    pageView.$data.editMode = viewState.editMode;
}

function handleDeleteButtonPressed(billClickedIndex) {
    userData.debts = userData.debts.filter((item, index) => {
        return billClickedIndex !== index;
    });
    pageView.$data.debts = userData.debts;
    localStorageManager.set('userDebts', userData.debts);
}

function handleIncomeInputChanged(event) {
    userData.income = event.target.value;
    pageView.$data.income = event.target.value;
    localStorageManager.set('userIncome', userData.income);
}

Vue.component('credit-card-input', creditCardInput);
Vue.component('savings-input', savingsInput);
Vue.component('bill', bill);
Vue.component('inputIncome', inputIncome);

const pageView = new Vue({
    el: '#root',
    data: {
        debts: userData.debts,
        editMode: viewState.editMode,
        income: userData.income
    },
    methods: {
        handleDebitChanged,
        handleCreditCardDebtCalculation,
        handleSavingsCalculation
    },
    render () {
        const h = this.$createElement;
        return (
            <div class="budget-app">
                <button on-click={handleEditModeButtonPressed}>Edit Mode</button>
                <div class="income">
                    {
                        this.$data.editMode
                        ?
                            <inputIncome income={ userData.income } handle-income-input-changed={handleIncomeInputChanged}/>
                        :
                            <p>
                                Income: ${ userData.income }
                            </p>
                    }
                </div>
                {
                    !this.$data.editMode
                    ?
                        <div class="bills-header">
                            <p>
                                Type
                            </p>
                            <p>
                                Name
                            </p>
                            <p>
                                Amount
                            </p>
                            <p>
                                Amount Left
                            </p>
                        </div>
                    :
                        null
                }
                <bill
                    debts={this.$data.debts}
                    edit-mode={this.$data.editMode}
                    handle-add-debit-clicked={handleAddDebitClicked}
                    handle-delete-button-pressed={handleDeleteButtonPressed}
                    handle-debit-changed={handleDebitChanged}
                    income={this.$data.income}
                />
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

if (process.NODE_ENV !== 'production') {
    window.zz = viewState;
    window.qq = userData;
}