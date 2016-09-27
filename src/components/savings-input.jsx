export default {
    props: [
        'initialSavings',
        'rate',
        'saving',
        'handleInputChanged',
        'handleFormSubmit'
    ],
    render(h) {
        console.log(this);
    return (
        <form ref="billForm">
            <label style={{display: 'block'}}>
                Current Debt
                <input type="number" value={this.initialSavings} on-change={this.handleInputChanged.bind(this, 'debt')}/>
            </label>
            <label style={{display: 'block'}}>
                Interest Rate
                <input type="number" value={this.rate} on-change={this.handleInputChanged.bind(this, 'rate')}/>
            </label>
            <label style={{display: 'block'}}>
                Monthly Repayment
                <input type="number" value={this.saving} on-change={this.handleInputChanged.bind(this, 'repay')}/>
            </label>
            <button type="button" style={{display: 'block'}} on-click={this.handleFormSubmit.bind(this)}>
                Submit
            </button>
        </form>
    )
}
}