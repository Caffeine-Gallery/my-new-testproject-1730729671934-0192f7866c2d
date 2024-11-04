import { backend } from 'declarations/backend';

let currentInput = '';
let currentOperation = null;
let previousInput = null;

const display = document.getElementById('display');
const loading = document.getElementById('loading');

document.querySelectorAll('.num').forEach(button => {
    button.addEventListener('click', () => {
        currentInput += button.textContent;
        updateDisplay();
    });
});

document.querySelectorAll('.op').forEach(button => {
    button.addEventListener('click', () => {
        if (currentInput !== '') {
            if (previousInput !== null) {
                calculate();
            } else {
                previousInput = parseFloat(currentInput);
            }
            currentOperation = button.textContent;
            currentInput = '';
        }
    });
});

document.getElementById('equals').addEventListener('click', calculate);

document.getElementById('clear').addEventListener('click', () => {
    currentInput = '';
    currentOperation = null;
    previousInput = null;
    updateDisplay();
});

function updateDisplay() {
    display.value = currentInput;
}

async function calculate() {
    if (previousInput !== null && currentOperation && currentInput !== '') {
        const num1 = previousInput;
        const num2 = parseFloat(currentInput);
        loading.classList.remove('hidden');
        try {
            let result;
            switch (currentOperation) {
                case '+':
                    result = await backend.add(num1, num2);
                    break;
                case '-':
                    result = await backend.subtract(num1, num2);
                    break;
                case '*':
                    result = await backend.multiply(num1, num2);
                    break;
                case '/':
                    result = await backend.divide(num1, num2);
                    break;
            }
            currentInput = result.toString();
            previousInput = null;
            currentOperation = null;
            updateDisplay();
        } catch (error) {
            console.error('Calculation error:', error);
            currentInput = 'Error';
            updateDisplay();
        } finally {
            loading.classList.add('hidden');
        }
    }
}
