import Vue from 'vue';
import Chart from 'chart.js';
import creditCardInput from '../components/credit-card-input.jsx';
import savingsInput from '../components/savings-input.jsx';

function calculateSavingsInAYear(savings, payment, interest, month = 1, valueSoFar = {}) {
    if (month < 12) {
        const monthlyInterest = (savings * interest) / 12;
        const newSavings = ((savings + monthlyInterest) + payment);
        calculateSavingsInAYear(newSavings, payment, interest, month + 1, {...valueSoFar, [month]: newSavings});
    } else {
        return valueSoFar;
    }
}

function calculateRepayments(debt, repay, interest, month = 1, valueSoFar = {}) {
    if (debt > 0) {
        const monthlyInterest = (debt * interest) / 12;
        const newDebt = ((debt + monthlyInterest) - repay);
        return calculateRepayments(newDebt, repay, interest, month + 1, {...valueSoFar, [month]: debt});
    } else {
        return {...valueSoFar, [month]: 0 };
    }
}

function handleCreditCardDebtCalculation(event) {
    event.preventDefault();
    const debt = parseInt(viewState.billFormData.debt) * 100;
    const repayment = parseInt(viewState.billFormData.repay) * 100;
    const rate = parseInt(viewState.billFormData.rate) / 100;
    viewState.creditRepayment = calculateRepayments(debt, repayment, rate);
    const creditChart = new Chart(document.getElementById('chart'), {
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
    const debt = parseInt(viewState.billFormData.debt) * 100;
    const repayment = parseInt(viewState.billFormData.repay) * 100;
    const rate = parseInt(viewState.billFormData.rate) / 100;
    viewState.creditRepayment = calculateRepayments(debt, repayment, rate);
    const creditChart = new Chart(document.getElementById('savings_chart'), {
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
    creditRepayment: {}
};

function handleFormInputChanged(whichInput, event) {
    viewState.billFormData[whichInput] = event.target.value;
}

Vue.component('debt-input', creditCardInput);

const pageView = new Vue({
    el: '#root',
    data: {},
    methods: {},
    render () {
        const h = this.$createElement;
        return (
            <div>
                <debt-input debt={viewState.billFormData.debt} repay={viewState.billFormData.repay} rate={viewState.billFormData.rate} handle-form-submit={handleCreditCardDebtCalculation} handle-input-changed={handleFormInputChanged}/>
                <canvas id="chart" width="400" height="400"/>
                <canvas id="savings_chart" width="400" height="400"/>
            </div>
        )
    }
});

