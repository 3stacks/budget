export default {
    props: [
        'debt',
        'rate',
        'repay',
        'handleInputChanged',
        'handleFormSubmit'
    ],
    render(h) {
    return (
        <form ref="billForm" class="calculator-input">
            <label>
                <span>
                    Current Debt
                </span>
                <input type="number" value={this.debt} on-change={this.handleInputChanged.bind(this, 'debt')}/>
            </label>
            <label>
                <span>
                    Interest Rate
                </span>
                <input type="number" value={this.rate} on-change={this.handleInputChanged.bind(this, 'rate')}/>
            </label>
            <label>
                <span>
                    Monthly Repayment
                </span>
                <input type="number" value={this.repay} on-change={this.handleInputChanged.bind(this, 'repay')}/>
            </label>
            <button type="button" on-click={this.handleFormSubmit.bind(this)}>
                Submit
            </button>
        </form>
    )
}
}