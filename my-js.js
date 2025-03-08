const buttons = document.querySelector("#buttons");
const displayFirstNumber = document.querySelector("#first-number");
const displaySecondNumber = document.querySelector("#second-number");
const displayOperator = document.querySelector("#operator");
const expressionResult = document.querySelector("#expression-result");

let num1 = null;
let num2 = null;
let operator = null;
let firstTime = true;

// Event delegation for button clicks
buttons.addEventListener('click', (e) => handleMouseAndkeyboard(e, 'mouse'));

function handleMouseAndkeyboard(e, hardWareInput, button = null) {
    const inputNumber = hardWareInput === 'mouse' ? e.target.getAttribute('data-num') : button.getAttribute('data-num');
    const inputOperation = hardWareInput === 'mouse' ? e.target.getAttribute('data-operation') : button.getAttribute('data-operation');

    if (inputOperation === 'clear') {
        clearCalculator();
    } else if (inputOperation === 'clear-entry') {
        clearEntry();
    } else if (inputNumber) {
        handleNumberInput(inputNumber);
    } else if (inputOperation && num1) {
        handleOperatorInput(inputOperation);
    }
}

// Handle number input
function handleNumberInput(number) {
    expressionResult.textContent = ''; // Clear result display

    if (!operator) {
        if(firstTime) {
            // Update first number
            if(number !== '0') {
                num1 = num1 ? num1.toString() + number : number;
                displayFirstNumber.textContent = num1;
            } else {
                displayFirstNumber.textContent = '';
                expressionResult.textContent = 0;
            }
        } else {
            if (number !== '0') {
                displayFirstNumber.textContent = number;
                displaySecondNumber.textContent = '';
                displayOperator.textContent = '';
                num1 = number;
                num2 = null;
                operator = null;
                firstTime = true;
            } else {
                displayFirstNumber.textContent = 0;
                displaySecondNumber.textContent = '';
                displayOperator.textContent = '';
                num1 = 0;
            }
        }
    } else {
        // Update second number
        num2 = num2 ? num2.toString() + number : number;
        displaySecondNumber.textContent = num2;
    }
}

// Handle operator input
function handleOperatorInput(operation) {
    if (operation === 'equals' && num2) {
        // Calculate result
        const result = operate(operator, num1, num2);
        expressionResult.textContent = Math.round(result * 100) / 100; // Round to 2 decimal places
        num1 = result.toString(); // Set result as the first number for further calculations
        num2 = null;
        operator = null;
        firstTime = false;
    } else {
        // Set operator
        operator = operation;
        displayOperator.textContent = getOperatorSymbol(operation);
        if (!firstTime) {
            displayFirstNumber.textContent = Math.round(num1 * 100) / 100;

            if (!num2) {
                displaySecondNumber.textContent = '';
            }
        }
    }
}

// Clear the calculator
function clearCalculator() {
    displayFirstNumber.textContent = '';
    displaySecondNumber.textContent = '';
    displayOperator.textContent = '';
    expressionResult.textContent = '';
    num1 = null;
    num2 = null;
    operator = null;
    firstTime = true;
}

// Clear the current entry
function clearEntry() {
    if (firstTime) {
        displayFirstNumber.textContent = '';
        displayOperator.textContent = '';
        num1 = null;
        operator = null;
    }
    
    displaySecondNumber.textContent = '';
    num2 = null;
    if (!firstTime) {
        displayFirstNumber.textContent = '';
        displayOperator.textContent = '';
        expressionResult.textContent = '';
        num1 = null;
        operator = null;
        firstTime = true;
    }
}

// Get the symbol for the operator
function getOperatorSymbol(operation) {
    return { add: "+", subtract: "−", multiply: "*", divide: "/" }[operation] || ""; 
}

// Perform the operation
const operations = {
    add: (num1, num2) => num1 + num2,
    subtract: (num1, num2) => num1 - num2,
    multiply: (num1, num2) => num1 * num2,
    divide: (num1, num2) => num1 / num2,
};

function operate(operator, num1, num2) {
    const operationFunction = operations[operator];
    if (operationFunction) {
        return operationFunction(+num1, +num2);
    }
    throw new Error(`Unknown operator: ${operator}`);
}

document.addEventListener('keydown', (e) => {
    const key = e.key;

    const keyToButtonMap = {
        '0': '[data-num="0"]',
        '1': '[data-num="1"]',
        '2': '[data-num="2"]',
        '3': '[data-num="3"]',
        '4': '[data-num="4"]',
        '5': '[data-num="5"]',
        '6': '[data-num="6"]',
        '7': '[data-num="7"]',
        '8': '[data-num="8"]',
        '9': '[data-num="9"]',
        '.': '[data-num="."]',
        '+': '[data-operation="add"]',
        '-': '[data-operation="subtract"]',
        '*': '[data-operation="multiply"]',
        '/': '[data-operation="divide"]',
        'Enter': '[data-operation="equals"]',
        'Backspace': '[data-operation="clear-entry"]',
        'Escape': '[data-operation="clear"]',
    };

    const buttonSelector = keyToButtonMap[key];
    if (buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            handleMouseAndkeyboard(e, 'keyboard', button)
        }
    }
});