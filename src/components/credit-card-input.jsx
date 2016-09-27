export default {
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
}