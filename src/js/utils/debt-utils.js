export function calculateRepayments(debt, repay, interest, month = 1, valueSoFar = {}) {
    if (debt > 0) {
		const monthlyInterest = (((interest / 12) / 100) * debt) * 100;
        const newDebt = ((debt + monthlyInterest) - repay);
        return calculateRepayments(newDebt, repay, interest, month + 1, {...valueSoFar, [month]: debt});
    } else {
        return {...valueSoFar, [month]: 0 };
    }
}
