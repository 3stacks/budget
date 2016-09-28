export function calculateSavingsInAYear(savings, payment, interest, month = 1, valueSoFar = {}) {
    if (month <= 12) {
        const monthlyInterest = (savings * interest) / 12;
        const newSavings = ((savings + monthlyInterest) + payment);
        return calculateSavingsInAYear(newSavings, payment, interest, month + 1, {...valueSoFar, [month]: newSavings});
    } else {
        return valueSoFar;
    }
}