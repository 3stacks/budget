export default {
    props: [
        'income',
        'handleIncomeInputChanged'
    ],
    render(h) {
        return (
            <div>
                <label class="dollar-label">
                    Income
                    <input value={this.income} type="number" on-change={this.handleIncomeInputChanged}/>
                </label>
            </div>
        )
    }
}