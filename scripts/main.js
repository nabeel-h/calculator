function add (val1, val2) {
    let result = val1 + val2;
    return Math.round(result * 10000) / 10000;
};

function subtract(val1, val2) {
    let result = add(val1, val2 * -1)
    return Math.round(result * 10000) / 10000;
};

function divide(val1, val2) {
    let result = val1 / val2;
    return Math.round(result * 10000)/10000;
};

function multiply(val1, val2) {
    let result = val1 * val2;
    return Math.round(result * 10000)/10000;
};

function equals() {
    console.log("EQUALS FUNCTION USED");
};

function convertToNeg(val) {
    return "("+(val*-1)+")";
};

function convertBackNeg(val) {
    if (val[0]==="(") {
        console.log("converting:", val," to ",Number(val.slice(1,-1)) * -1);
        return Number(val.slice(1,-1)) * -1;
    };
    return val;
};

function removeBracketsFromArray(array){
    // deletes ( and ) and . from operand array since regex grabs them
    // and it screws up the operation function
    let newArray = [];
    for (let j = 0; j<array.length;j++) {
        if (array[j] == "(" || array[j] === ")" || array[j] === ".") {
            continue;
        };
        newArray.push(array[j]);
    };
    return newArray;};
    

let operators = {
    "del": deleteInput,
    "ce": clearInput,
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide
};


function getOperandFromString(inputValue) {
    let listOfNonNumerals = inputValue.match(/[^A-Za-z0-9]/g);
    let inputOperand = null;
    for (let i=0; i < listOfNonNumerals.length; i++) {
        switch (listOfNonNumerals[i]) {
            case "-":
            case "/":
            case "*":
            case "+":
                inputOperand = listOfNonNumerals[i];
                break;
            break;
        };
    };
    return inputOperand;
};

function processOperandsAndVariables(operandsAndVariables) {
    // finds highest priority operation ( * > + e.g)
    // performs operation on appropriate variables its next to
    // returns new operand and variable list without
    // without the operand and with the two variables replaced with
    // the result

    let operatorPriority = ["/", "*", "+", "-"];
    let operandList = operandsAndVariables["operandList"];
    console.log(operandList);
    let variableList = operandsAndVariables["variableList"];
    // Deletes "" aka empty string variables from variables input
    // THESE ARE PRODUCED BY NEGATIVE NUMBERS, WHEN THEY ARE STRIPPED
    // OF THE BRACKETS FOR THEIR NEGATIVE REPRESENTATION
    // CHANGE THE NEXT ELEMENT TO NEGATIVE BY MULTIPLYING BY 0!!
    // ALSO DELETE THE NEGATIVE OPERAND
    for (let x=0; x < variableList.length;x++) {
        if (variableList[x].length < 1) {
            variableList[x+1] = variableList[x+1] * -1;
            variableList.splice(x, 1);
            operandList.splice(x, 1);
        };
    };

    console.log(variableList);

    // if just one variable is input (aka -3 or (3) just return it).
    if (variableList.length == 1) {
        return operandsAndVariables;
    };

    let opFound = false;
    operatorPriority.forEach(opPriority => {
        console.log(`Trying: ${opPriority}`);
        if ((operandList.indexOf(opPriority) > -1) && (opFound === false) ) {
            console.log(`Found ${opPriority}`);
            let opPosition = operandList.indexOf(opPriority);
            let var1 = Number(variableList[opPosition]);
            let var2 = Number(variableList[opPosition + 1]);
            console.log(var2);
            let op = new operation(var1, var2, operators[opPriority]);
            op.performOperation();
            console.log(op.printString);
            console.log(`Result ^: ${op.result}`);

            let result = op.result;

            // delete operand from list
            operandList.splice(opPosition, 1);
            // delete variables and replace with result
            variableList.splice(opPosition, 2);
            variableList.splice(opPosition, 0, result);
            opFound = true;
        };
    });
    console.log("return arrays");
    console.log(operandList, variableList);
    return operandsAndVariables;
};

function processOperationString(inputValue){
    // "1+1" = 2
    // "1+1-2" = 0
    // "1+3-5" = (1)
    // "9+3*3" = 18
    // "9/3 -1" = 2
    // "9-1+4/2*8" = 7.75
    var separators = ['+', '*', '\\/','-'];
    let splitVariablesList = inputValue.split(new RegExp('[' + separators.join('') + ']', 'g'));
    // if any of input is negative (2), convert back to negative
    for (let x=0; x < splitVariablesList.length;x++) {
        splitVariablesList[x] = convertBackNeg(splitVariablesList[x]);
    };

    console.log(splitVariablesList);
    let splitOperandsList = removeBracketsFromArray(inputValue.match(/[^A-Za-z0-9]/g));
    //console.log(splitOperandsList);

    let operandsAndVariables = {
                            "operandList": splitOperandsList,
                            "variableList": splitVariablesList
                                };

    while (operandsAndVariables["variableList"].length > 1) {
        //console.log(operandsAndVariables);
        operandsAndVariables = processOperandsAndVariables(operandsAndVariables);
    };
    //console.log(operandsAndVariables["variableList"][0]);
    return operandsAndVariables["variableList"][0];
};

function handleOperation(e) {
    const inputP = document.querySelector("#calculatorInput_p");
    const outputP = document.querySelector("#calculatorOutput_p");

    let inputValue = inputP.textContent
    // if no value in input do nothing
    // except if subtract is pressed
    if (inputP.textContent.length < 1) {
        if (e.target.textContent === "-") {
            updateInput(e);
            return null;
        };
        return null;
    };

    switch (e.target.textContent) {
        case "+":
        case "-":
        case "/":
        case "*":
        case "=":
        // if user presses =
        if (e.target.textContent === "=") {
            // if last value is an operator and = sign is pressed, do nothing
            if (isNaN(Number(inputValue.split("")[inputValue.length - 1]))) {
                return nulll;
            }

            // return Result, change formatting if its a negative value!
            let returnResult = processOperationString(inputValue);
            if (returnResult < 0) {
                returnResult = convertToNeg(returnResult);
            };
            console.log(`result: ${returnResult}`);
            updateOutput(returnResult); 
            return null;
        } else {
            // if value in output and an operator is used, take value and put it in input with operator
            // and delete the output data
            if (outputP.textContent != "") {
                console.log("stuff");
                console.log(outputP.textContent);
                console.log(e.target.textContent);
                inputP.textContent = (outputP.textContent + e.target.textContent);
                clearOutput();
                return null;
            };

            // if last charachter in string is an operator and user presses another operator
            // replace that operator with the new one
            // UNLESS operator is - then add -1 ??
            if (isNaN(Number(inputValue.split("")[inputValue.length - 1]))) {
                deleteInput(e);
                updateInput(e);
                return null;    
            };
            
            
            // otherwise just add operator
            updateInput(e);
            return null
        };
        break

        default:
            console.log("adding digit?");
            updateInput(e);
            break
    };
};


function updateInput(e) {
    console.log("Updating input");
    const inputP = document.querySelector("#calculatorInput_p");
    const outputP = document.querySelector("#calculatorOutput_p");
    
    switch (e.target.textContent) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case ".":
        // if there is a value in the output, then clear it and add new input
        if (outputP.textContent.length > 0) {
            inputP.textContent = outputP.textContent + e.target.textContent;  
            clearOutput();
            return null;
        };
        
        var separators = ['+', '*', '\\/','-'];
        let splitVariablesList = inputP.textContent.split(new RegExp('[' + separators.join('') + ']', 'g'));
        let lastVariable = splitVariablesList[splitVariablesList.length - 1];
        // if . (decimal point) is present within the last 5 digits, do add another .
        // add numbers but a max of 4 after
        if (lastVariable.indexOf(".") > -1) {
            if (e.target.textContent === ".") {
                return null
            };
            if ((lastVariable.length - lastVariable.indexOf(".")) > 5) {
                return null;
            };
        };
        inputP.textContent += e.target.textContent;
        break

    default:
        inputP.textContent += e.target.textContent;
        break
    };
};

function deleteInput(e) {
    const inputP = document.querySelector("#calculatorInput_p");
    if (inputP.textContent.length < 2) {
        inputP.textContent = "";
        return null;
    };
    inputP.textContent = inputP.textContent.slice(0,-1);
};

function clearInput(e) {
    const inputP = document.querySelector("#calculatorInput_p");
    inputP.textContent = "";
    clearOutput();
};

function updateOutput(result) {
    const inputP = document.querySelector("#calculatorOutput_p");
    inputP.textContent = result;
};

function clearOutput() {
    const outputP = document.querySelector("#calculatorOutput_p");
    outputP.textContent = "";
}

class operation {
    constructor(val1, val2, operation) {
        this.val1 = val1;
        this.val2 = val2;
        this.operation = operation;
        this.result = null;
        this.printString = this.printOperation()
    }

    performOperation() {
        if (this.result != null) {
            console.log("Operation already performed!")
        };
        let operationResult = this.operation(this.val1, this.val2);
        this.result = operationResult;
        console.log(this.result);
    };

    printOperation() {
        let opSymbol = null;
        switch (this.operation.name) {
            case "add":
                opSymbol = "+";
                break;
            case "subtract":
                opSymbol = "-";
                break;
            case "divide":
                opSymbol = "/";
                break;
            case "multiply":
                opSymbol = "*";
                break;
        }
        let printString = "("+this.val1+" "+opSymbol+" "+this.val2+")";
        return printString;
    }
};


function createNumberButtons() {
    const calculatorButtons_numbers = document.querySelector("#calculatorButtons_numbers")
    for (let i=1;i < 12 ;i++) {
        let numberButton = document.createElement("a");
        if (i === 10) {
            numberButton.textContent = 0;
        } else if (i === 11) {
            numberButton.textContent = ".";
        } else {
            numberButton.textContent = i;
        }

        numberButton.addEventListener("click", updateInput);
        calculatorButtons_numbers.appendChild(numberButton)
    }
    
};

function createOperatorButtons() {
    const calculatorButtons_operators = document.querySelector("#calculatorButtons_operators")
    let operators = {
        "del": deleteInput,
        "ce": clearInput,
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
        "=": "equals"
    };

    for (let prop in operators) {
        let operatorButton = document.createElement("a");
        operatorButton.textContent = prop;

        if (prop === "del" || prop === "ce") {
            operatorButton.addEventListener("click", operators[prop]);
        } else
        {
            operatorButton.addEventListener("click", handleOperation);
        };

        calculatorButtons_operators.appendChild(operatorButton)
    }
};

createNumberButtons();
createOperatorButtons();
