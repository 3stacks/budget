// Dependencies
import Vue from 'vue';
import Chart from 'chart.js';
import * as localStorageManager from '@lukeboyle/local-storage-manager';
// Components
import creditCardInput from './components/credit-card-input.jsx';
import savingsInput from './components/savings-input.jsx';
import bill from './components/bill.jsx';
import inputIncome from './components/input-income.jsx';
import modal from './components/modal.jsx';
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
    editMode: false,
    savingsModalOpen: false,
    creditModalOpen: false
};

const userData = {
    income: safelyGetIncome(),
    incomeFrequency: 'Weekly',
    debts: safelyGetDebits(),
};

function safelyGetIncome() {
    if (localStorageManager.get('userIncome', 'budgetApp') === null) {
        return 0;
    } else {
        return localStorageManager.get('userIncome', 'budgetApp');
    }
}

function safelyGetDebits() {
    if (localStorageManager.get('userDebts', 'budgetApp') === null) {
        return [
            {
                name: 'New Debit',
                type: 'Bill',
                value: 0
            }
        ];
    } else {
        return localStorageManager.get('userDebts','budgetApp');
    }
}

function handleCreditCardDebtCalculation(event) {
    event.preventDefault();
    const debt = parseInt(viewState.billFormData.debt) * 100;
    const repayment = parseInt(viewState.billFormData.repay) * 100;
    const rate = parseInt(viewState.billFormData.rate) / 100;
    viewState.creditRepayment = calculateRepayments(debt, repayment, rate);
    const creditChart = new Chart(this.$refs.creditChart, {
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
    const savingsCart = new Chart(this.$refs.savingsChart, {
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
    localStorageManager.set('userDebts', userData.debts, 'budgetApp');
}

function handleAddDebitClicked() {
    userData.debts.push({
        name: 'New Debit',
        type: 'Bill',
        value: 0
    });
    localStorageManager.set('userDebts', userData.debts, 'budgetApp');
    const billTypeList = document.querySelectorAll('.bill-input--type');
    billTypeList[billTypeList.length - 1].focus();
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
    localStorageManager.set('userDebts', userData.debts, 'budgetApp');
}

function handleIncomeInputChanged(event) {
    userData.income = event.target.value;
    pageView.$data.income = event.target.value;
    localStorageManager.set('userIncome', userData.income, 'budgetApp');
}

function handleCreditModalButtonPressed() {
    viewState.creditModalOpen = true;
    pageView.$data.creditModalOpen = true;
}

function handleCreditModalCloseRequested() {
    viewState.creditModalOpen = false;
    pageView.$data.creditModalOpen = false;
}

function handleSavingsModalButtonPressed() {
    viewState.savingsModalOpen = true;
    pageView.$data.savingsModalOpen = true;
}

function handleSavingsModalCloseRequested() {
    viewState.savingsModalOpen = false;
    pageView.$data.savingsModalOpen = false;
}

function handleExportButtonPressed() {
    const data = {
        income: localStorageManager.get('userIncome', 'budgetApp'),
        bills: localStorageManager.get('userDebts', 'budgetApp')
    };

    alert(`Copy this string to your clipboard and save it: ${JSON.stringify(data)}`);
    // let csvBase = "data:text/csv;charset=utf-8,";
    // csvBase = `${csvBase}\nUser Income\n${data.income}\n`;
    // const dataAsCsv = data.map(function(infoArray, index) {
    //
    //     dataString = infoArray.join(",");
    //     csvContent += index < data.length ? dataString+ "\n" : dataString;
    //
    // });
    // download(`userDebts${new Date().getDate()}`, props.spec.toString());
}
//
// /**
//  * @see http://stackoverflow.com/a/18197511/1063035
//  * @param filename
//  * @param text
//  */
// function download(filename, text) {
//     var pom = document.createElement('a');
//     pom.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
//     pom.setAttribute('download', filename);
//
//     if (document.createEvent) {
//         var event = document.createEvent('MouseEvents');
//         event.initEvent('click', true, true);
//         pom.dispatchEvent(event);
//     }
//     else {
//         pom.click();
//     }
// }

function handleSaveDebitsClicked() {
    handleEditModeButtonPressed();
}

Vue.component('credit-card-input', creditCardInput);
Vue.component('savings-input', savingsInput);
Vue.component('bill', bill);
Vue.component('inputIncome', inputIncome);
Vue.component('modal', modal);

const pageView = new Vue({
    el: '#root',
    data: {
        debts: userData.debts,
        editMode: viewState.editMode,
        income: userData.income,
        creditModalOpen: viewState.creditModalOpen,
        savingsModalOpen: viewState.savingsModalOpen
    },
    methods: {
        handleDebitChanged,
        handleCreditCardDebtCalculation,
        handleSavingsCalculation,
        handleSavingsModalButtonPressed,
        handleSavingsModalCloseRequested,
        handleCreditModalButtonPressed,
        handleCreditModalCloseRequested,
        handleExportButtonPressed,
        handleSaveDebitsClicked
    },
    render () {
        const h = this.$createElement;
        return (
            <div class="budget-app">
                <div class="version">
                    Alpha Version 0.0.4
                </div>
                <header class="header">
                    <div class="max-width-container">
                        <div class="header--inner">
                            <div class="header--site-name">
                                Budget
                            </div>
                            <div class="header--buttons">
                                <button class="header--export" on-click={handleExportButtonPressed}>
                                    <img src="img/export.svg" alt="Export"/>
                                </button>
                                <button class="header--piggy" on-click={handleSavingsModalButtonPressed}>
                                    <img src="img/piggy.svg" alt="Savings Calculator"/>
                                </button>
                                <button class="header--credit-card" on-click={handleCreditModalButtonPressed}>
                                    <img src="img/credit.svg" alt="Credit Card Calculator"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <div class="budget-app--inner">
                    <div class="budget-app--inner--head">
                        <div class="budget-app--inner--head--income">
                            {
                                this.$data.editMode
                                    ?
                                    <inputIncome income={ userData.income } handle-income-input-changed={handleIncomeInputChanged}/>
                                    :
                                    <p>
                                        <span>Income: </span><span>${ userData.income }</span>
                                    </p>
                            }
                        </div>
                        <button class="budget-app--inner--head--edit" on-click={handleEditModeButtonPressed}>
                            <img src="img/gear.svg" alt="Edit Mode"/>
                        </button>
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
                        handle-save-debits-clicked={handleSaveDebitsClicked}
                    />
                    {
                        this.$data.creditModalOpen
                        ?
                            <modal modal-title="Calculate credit card repayments" handle-close-requested={handleCreditModalCloseRequested}>
                                <credit-card-input
                                    debt={viewState.billFormData.debt}
                                    repay={viewState.billFormData.repay}
                                    rate={viewState.billFormData.rate}
                                    handle-form-submit={handleCreditCardDebtCalculation.bind(this)}
                                    handle-input-changed={handleDebtFormChanged}
                                />
                                <canvas ref="creditChart"/>
                            </modal>
                        :
                            null
                    }
                    {
                        this.$data.savingsModalOpen
                        ?
                            <modal modal-title="Calculate savings in a year" handle-close-requested={handleSavingsModalCloseRequested}>
                                <savings-input
                                    initial-savings={viewState.savingsFormData.savings}
                                    saving={viewState.savingsFormData.payment}
                                    rate={viewState.savingsFormData.rate}
                                    handle-form-submit={handleSavingsCalculation.bind(this)}
                                    handle-input-changed={handleSavingsFormChanged}
                                />
                                <canvas ref="savingsChart"/>
                            </modal>
                        :
                            null
                    }
                </div>
            </div>
        )
    }
});

if (process.NODE_ENV !== 'production') {
    window.zz = viewState;
    window.qq = userData;
}
