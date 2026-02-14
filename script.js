const firstNumBox = document.querySelector('.firstnum');
const secondNumBox = document.querySelector('.secondnum');
const resultBox = document.querySelector('.result');
const input = document.querySelector('.resfield');
let inputValue = null;

function getRndNum() {
    return Math.floor(Math.random() * 9) + 1;
}

let firstNum = getRndNum();
let secondNum = getRndNum();
let result = firstNum * secondNum;

console.log(`result = ${result}`);

console.log(firstNumBox)
firstNumBox.innerText = firstNum;
secondNumBox.innerText = secondNum;

input.addEventListener('blur', () => {
    input.focus();
});

// фокус при старті
input.focus();

// Слухаємо натискання клавіші
input.addEventListener('keydown', (event) => {

    // Перевіряємо, чи це Enter
    if (event.key === 'Enter') {

        // Беремо значення з input
        inputValue = +input.value;
        console.log(`inputValue = ${inputValue}`);

        if (inputValue === result) {
            resultBox.style.backgroundColor = 'green';
            setTimeout(function () {
                firstNum = getRndNum();
                secondNum = getRndNum();
                firstNumBox.innerText = firstNum;
                secondNumBox.innerText = secondNum;
                resultBox.style.backgroundColor = '#edf8f8';
                result = firstNum * secondNum;
                input.value = ''
            }, 2000);
        } else {
            resultBox.style.backgroundColor = 'red';
            input.value = ''
        }

    }
});
