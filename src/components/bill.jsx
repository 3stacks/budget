const availableTypes = [
    'Bill',
    'Savings'
];

export function renderBillInputs(h, bill, index, handleDeleteButtonPressed, handleDebitChanged) {
    return (
        <div class="bill-input">
            <button on-click={handleDeleteButtonPressed.bind(this, index)}>&times;</button>
            <label>
                Bill Name
                <input type="text" name={`name-${index}`} on-change={handleDebitChanged.bind(this, bill, index)} value={bill.name}/>
            </label>
            <label class="bill-input--value">
                Bill Amount
                <input type="text" name={`value-${index}`} on-change={handleDebitChanged.bind(this, bill, index)} value={bill.value}/>
            </label>
            <label>
                Bill Type
                <select type="text" name={`type-${index}`} on-change={handleDebitChanged.bind(this, bill, index)} selected={bill.type}>
                    {
                        availableTypes.map((type) => {
                            return <option value={type}>{type}</option>;
                        })
                    }
                </select>
            </label>
        </div>
    )
}
export function renderReadBill(h, bill, index) {
    return (
        <div class="bill">
            <span name={`name-${index}`} class="bill--name">
                {bill.name}
            </span>
            <span name={`value-${index}`} class="bill--value">
                ${bill.value}
            </span>
            <span name={`type-${index}`} class="bill--type">
                {bill.type}
            </span>
        </div>
    )
}

export default {
    props: [
        'debts',
        'editMode',
        'handleAddDebitClicked',
        'handleDeleteButtonPressed',
        'handleDebitChanged'
    ],
    render(h) {
        console.log(this.editMode);
        if (this.editMode) {
            return (
                <div>
                    { this.debts.map((item, index) => {
                        return renderBillInputs(h, item, index, this.handleDeleteButtonPressed, this.handleDebitChanged);
                    }) }
                    <button on-click={this.handleAddDebitClicked}>Add Debit</button>
                </div>
            )
        } else {
            {this.debts.map((item, index) => {
                return renderReadBill(h, item, index);
            })}
        }
    }
}