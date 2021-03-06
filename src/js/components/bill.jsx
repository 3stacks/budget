const availableTypes = [
    'Bill',
    'Savings',
    'Credit'
];

function renderBillInputs(h, bill, index, handleDeleteButtonPressed, handleDebitChanged) {
    return (
        <div class="bill-input">
            <button on-click={handleDeleteButtonPressed.bind(this, index)}>&times;</button>
            <label>
                Bill Type
                <div class="select-wrapper bill-input--type">
                    <select type="text" name={`type-${index}`} on-change={handleDebitChanged}>
                        {
                            availableTypes.map((type) => {
                                return <option value={type} selected={bill.type === type}>{type}</option>;
                            })
                        }
                    </select>
                </div>
            </label>
            <div>
                <label>
                    Bill Name
                    <input type="text" name={`name-${index}`} on-change={handleDebitChanged} value={bill.name}/>
                </label>
            </div>
            <div>
                <label class="bill-input--value dollar-label">
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
                {bill.value.includes('%') ? `${bill.value}` : `$${bill.value}`}
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
        'handleSaveDebitsClicked',
        'handleDeleteButtonPressed',
        'handleDebitChanged',
        'income'
    ],
    render(h) {
        {theIncome = this.income}
        if (this.editMode) {
            return (
                <div>
					<div class="bill-input--container">
						{
							this.debts.map((item, index) => {
								return renderBillInputs(h, item, index, this.handleDeleteButtonPressed, this.handleDebitChanged.bind(this, item, index));
							})
						}
					</div>
					<div class="bill-button--container">
						<button class="bill-button" on-click={this.handleAddDebitClicked}>Add Debit</button>
						<button class="bill-button" on-click={this.handleSaveDebitsClicked}>Save Changes</button>
					</div>
				</div>
            )
        } else {
            return (
                <div>
                    {
                        this.debts.map((bill, index) => {
                            if (bill.type === 'Credit') {
                                theIncome = theIncome + parseInt(bill.value, 10);
                            } else {
                                if (bill.value.includes('%')) {
                                    const percentage = bill.value.slice(0, bill.value.length - 1);
                                    theIncome = theIncome - theIncome / 100 * parseInt(percentage, 10);
                                } else {
                                    theIncome = theIncome - parseInt(bill.value, 10);
                                }
                            }
                            return renderReadBill(h, bill, index, parseInt(theIncome, 10));
                        })
                    }
                </div>
            )
        }
    }
}