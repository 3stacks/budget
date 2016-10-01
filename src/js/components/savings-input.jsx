export default {
    props: [
        'initialSavings',
        'rate',
        'saving',
        'handleInputChanged',
        'handleFormSubmit'
    ],
    render(h) {
    return (
        <form ref="billForm" class="calculator-input">
            <label>
                <span>
                    Current Savings
                </span>
                <input type="number" value={this.initialSavings} on-change={this.handleInputChanged.bind(this, 'savings')}/>
            </label>
            <label>
                <span>
                    Interest Rate
                </span>
                <input type="number" value={this.rate} on-change={this.handleInputChanged.bind(this, 'rate')}/>
            </label>
            <label>
                <span>
                    Monthly Saving
                </span>
                <input type="number" value={this.saving} on-change={this.handleInputChanged.bind(this, 'payment')}/>
            </label>
            <button type="button" on-click={this.handleFormSubmit.bind(this)}>
                Submit
            </button>
        </form>
    )
}
}