const buttons = document.querySelector("#buttons");
const displayFirstNumber = document.querySelector("#first-number");
const displaySecondNumber = document.querySelector("#second-number");
const displayOperator = document.querySelector("#operator");
const expressionResult = document.querySelector("#expression-result");

let num1Global = null;
let num2Global = null;
let operatorGlobal = null;
let firstTimeGlobal = true;

// Events
buttons.addEventListener('click', (e) => handleMouseInput(e));
document.addEventListener('keydown', (e) => handleKeyboardInput(e));

function handleMouseInput(e) {
    handleInput(e.target);
}

function handleKeyboardInput(e) {
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

    const buttonSelector = keyToButtonMap[e.key];
    if (buttonSelector) handleInput(document.querySelector(buttonSelector));
};


function handleInput(target) {
    const inputNumber = target.getAttribute('data-num');
    const inputOperation = target.getAttribute('data-operation');

    if (inputNumber) handleNumber(inputNumber)
    else if (inputOperation) handleOperation(inputOperation);
}

// Handle number input
function handleNumber(number) {    
    // Prevent numbers with leading zeros (e.g., 00, 000, etc.)
    if (number === '0' && num1Global && num1Global.toString()[0] === '0') { return }
    if (number === '0' && num2Global && num2Global.toString()[0] === '0') { return }
    
    expressionResult.textContent = ''; // Clear result display

    // the idea is that if there is no operator then user is typing in the first number. but if there is an operator then user is typing in the second number
    if (!operatorGlobal) {
        // Update first number
        if(firstTimeGlobal) {
            // (... && num1Global !== '0') => Need to check this in order to not have number with leading zero, like 034 or 05
            num1Global = (num1Global && num1Global !== '0') ? num1Global.toString() + number : number;
            displayFirstNumber.textContent = num1Global;
        } else {
            displayFirstNumber.textContent = number;
            displaySecondNumber.textContent = '';
            displayOperator.textContent = '';
            num1Global = number;
            num2Global = null;
            operator = null;
            firstTimeGlobal = true;
        }
    } else {
        // Update second number
        num2Global = (num2Global && num2Global !== '0') ? num2Global.toString() + number : number;
        displaySecondNumber.textContent = num2Global;
    }
}

// Handle operator input
function handleOperation(operation) {
    if (operation === "clear") return clearCalculator();
    if (operation === "clear-entry") return clearEntry();
    if (operation === "equals" && num2Global) return calculateResult();
    
    operatorGlobal = operation;
    displayOperator.textContent = getOperatorSymbol(operation);

    if (!firstTimeGlobal) {
        displayFirstNumber.textContent = Math.round(num1Global * 100) / 100;

        if (!num2Global) {
            displaySecondNumber.textContent = '';
        }
    }
}

function calculateResult() {
    const result = operations[operatorGlobal](+num1Global, +num2Global);
    expressionResult.textContent = Math.round(result * 100) / 100;
    num1Global = result.toString();
    num2Global = operatorGlobal = null;
    firstTimeGlobal = false;
}

// Clear the calculator
function clearCalculator() {
    displayFirstNumber.textContent = '';
    displaySecondNumber.textContent = '';
    displayOperator.textContent = '';
    expressionResult.textContent = '';
    num1Global = null;
    num2Global = null;
    operatorGlobal = null;
    firstTimeGlobal = true;
}

// Clear the current entry
function clearEntry() {
    if (firstTimeGlobal) {
        displayFirstNumber.textContent = '';
        displayOperator.textContent = '';
        num1Global = null;
        operatorGlobal = null;
    }
    
    displaySecondNumber.textContent = '';
    num2Global = null;
    if (!firstTimeGlobal) {
        displayFirstNumber.textContent = '';
        displayOperator.textContent = '';
        expressionResult.textContent = '';
        num1Global = null;
        operatorGlobal = null;
        firstTimeGlobal = true;
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
