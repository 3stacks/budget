import Vue from 'vue';

function calculateSavingsInAYear(savings, payment, interest, month, interestPaid) {
    if (month < 12) {
        const monthlyInterest = (savings * interest) / 12;
        const newDebt = ((savings + monthlyInterest) + payment);
        calculateSavingsInAYear(newDebt, repay, interest, month + 1, interestPaid + monthlyInterest);
    } else {
        console.log(`You will save a total of $${parseInt(savings/100)}`);
        console.log(`You will earn a total of $${parseInt(interestPaid/100)} in interest.`);
    }
}

function calculateRepayments(debt, repay, interest, month, valueSoFar) {
    if (debt > 0) {
        console.log('hello');
        const monthlyInterest = (debt * interest) / 12;
        const newDebt = ((debt + monthlyInterest) - repay);
        calculateRepayments(newDebt, repay, interest, month + 1, {...valueSoFar, [month]: debt});
    } else {
        return valueSoFar;
    }
}

function handleCreditCardDebtCalculation(event) {
    event.preventDefault();
    console.log('first');
    console.log(calculateRepayments(10, 1, 0, 1, {}));
    // console.log(calculateRepayments(parseInt(viewState.billFormData.debt), (parseInt(viewState.billFormData.repay) / 100), (parseInt(viewState.billFormData.rate) / 100), 1, {}));
}

const viewState = {
    billFormData: {
        debt: 0,
        rate: 0,
        repay: 0
    }
};

function handleFormInputChanged(whichInput, event) {
    viewState.billFormData[whichInput] = event.target.value;
}

Vue.component('debt-input', {
    render(h) {
        return (
            <form ref="billForm">
                <label style={{display: 'block'}}>
                    Current Debt
                    <input type="number" value={viewState.billFormData.debt} on-change={handleFormInputChanged.bind(this, 'debt')}/>
                </label>
                <label style={{display: 'block'}}>
                    Interest Rate
                    <input type="number" value={viewState.billFormData.rate} on-change={handleFormInputChanged.bind(this, 'rate')}/>
                </label>
                <label style={{display: 'block'}}>
                    Monthly Repayment
                    <input type="number" value={viewState.billFormData.repay} on-change={handleFormInputChanged.bind(this, 'repay')}/>
                </label>
                <button type="button" style={{display: 'block'}} on-click={handleCreditCardDebtCalculation.bind(this)}>
                    Submit
                </button>
            </form>
        )
    }
});

const pageView = new Vue({
    el: '#root',
    data: {},
    methods: {},
    render () {
        const h = this.$createElement;
        return (
            <div>
                <debt-input/>
            </div>
        )
    }
});