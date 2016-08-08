import React from 'react';
import { render } from 'react-dom';
import AddExpenseForm from '../components/hello-world.jsx';

const mainElement = document.getElementById('root');

const app = (
    <div>
        <AddExpenseForm/>
    </div>
);

render(app, mainElement);