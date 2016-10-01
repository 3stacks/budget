const availableTypes = [
    'Bill',
    'Savings'
];

function renderBillInputs(h, bill, index, handleDeleteButtonPressed, handleDebitChanged) {
    return (
        <div class="bill-input">
            <button on-click={handleDeleteButtonPressed.bind(this, index)}>&times;</button>
            <label>
                Bill Type
                <select type="text" name={`type-${index}`} on-change={handleDebitChanged} selected={bill.type}>
                    {
                        availableTypes.map((type) => {
                            return <option value={type}>{type}</option>;
                        })
                    }
                </select>
            </label>
            <div>
                <label>
                    Bill Name
                    <input type="text" name={`name-${index}`} on-change={handleDebitChanged} value={bill.name}/>
                </label>
            </div>
            <div>
                <label class="bill-input--value">
                    Bill Amount
                    <input type="text" name={`value-${index}`} on-change={handleDebitChanged} value={bill.value}/>
                </label>
            </div>
        </div>
    )
}

function renderReadBill(h, bill, index, income) {
    return (
        <div class="bill" data-bill-type={bill.type.toLowerCase()}>
            <span name={`type-${index}`} class="bill--type">
                {bill.type}
            </span>
            <span name={`name-${index}`} class="bill--name">
                {bill.name}
            </span>
            <span name={`value-${index}`} class="bill--value">
                ${bill.value}
            </span>
            <span class="bill--income">
                ${income}
            </span>
        </div>
    )
}

let theIncome;

export default {
    props: [
        'debts',
        'editMode',
        'handleAddDebitClicked',
        'handleDeleteButtonPressed',
        'handleDebitChanged',
        'income'
    ],
    render(h) {
        {theIncome = this.income}
        if (this.editMode) {
            return (
                <div>
                    {
                        this.debts.map((item, index) => {
                            return renderBillInputs(h, item, index, this.handleDeleteButtonPressed, this.handleDebitChanged.bind(this, item, index));
                        })
                    }
                    <button on-click={this.handleAddDebitClicked}>Add Debit</button>
                </div>
            )
        } else {
            return (
                <div>
                    {
                        this.debts.map((bill, index) => {
                            theIncome = theIncome - bill.value;
                            return renderReadBill(h, bill, index, theIncome);
                        })
                    }
                </div>
            )
        }
    }
}