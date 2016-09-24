import Vue from 'vue';

function handleCreditCardDebtCalculation(currentDebt, rate = 13, monthlyRepayment, event) {
    event.preventDefault();
    console.log((currentDebt + currentDebt * 13 / 100) - monthlyRepayment);
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
    console.log(viewState);
}

Vue.component('debt-input', {
    render(h) {
        return (
            <form on-submit={handleCreditCardDebtCalculation}>
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
                <button style={{display: 'block'}} on-submit={handleCreditCardDebtCalculation}>
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