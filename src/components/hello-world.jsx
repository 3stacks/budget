import React from 'react';

export const AddExpenseForm = function(props) {
    function parseName(name) {
        if (name === undefined) {
            return 'Cool React Guy';
        } else {
            return name;
        }
    }
    return(
        <div>
            <p>
                New Expense
            </p>
            <label>
                <input type="text"/>
            </label>
            <img src="img/3stacks.png" alt="ayy lmao"/>
        </div>
    );
};

export default AddExpenseForm;