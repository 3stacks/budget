export function calculateRepayments(debt, repay, interest, month = 1, valueSoFar = {}) {
    if (debt > 0) {
        const monthlyInterest = (debt * interest) / 12;
        const newDebt = ((debt + monthlyInterest) - repay);
        return calculateRepayments(newDebt, repay, interest, month + 1, {...valueSoFar, [month]: debt});
    } else {
        return {...valueSoFar, [month]: 0 };
    }
}