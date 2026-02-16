const descriptionBox = document.querySelector(".action-description");
const mathActionBoxes = document.querySelectorAll(".math-action");

const firstNumBox = document.querySelector(".firstnum");
const secondNumBox = document.querySelector(".secondnum");

let firstNum = 0;
let secondNum = 0;
let result = 0;

const operatorBox = document.querySelector(".operator");

const resultBox = document.querySelector(".result");
const input = document.querySelector(".resfield");
let inputValue = null;
const mathActions = { add: "+", sub: "−", mul: "·", div: "∶" };
let mathActionValue = mathActions.mul;
const tipsContainer = document.querySelector(".tips");
const tipBoxes = document.querySelectorAll(".tip");
let arrForTips;
const tips = [];

mathActionBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    mathActionBoxes.forEach((b) => b.classList.remove("active"));
    box.classList.add("active");
    mathActionValue = box.dataset.hover;
    operatorBox.innerText = mathActionValue;
    descriptionBox.innerText = `виконай ${box.innerText}`;
    hideTips();
    setUp();
  });
});

const click = new Event("click");
document.querySelector(".math-action.active").dispatchEvent(click);

function getRndNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setUp() {
  let num1 = getRndNum();
  let num2 = getRndNum();
  console.log(`num1 = ${num1}`);
  console.log(`num2 = ${num2}`);
  const operator = mathActionValue;

  console.log(`operator = ${operator}`);

  if (operator === "+") {
    firstNum = num1;
    secondNum = num2;
    result = firstNum + secondNum;
  } else if (operator === "·") {
    firstNum = num1;
    secondNum = num2;
    result = firstNum * secondNum;
  } else if (operator === "−") {
    num1 = getRndNum(0, 20);
    num2 = getRndNum(0, 20);
    firstNum = Math.max(num1, num2);
    secondNum = Math.min(num1, num2);
    result = firstNum - secondNum;
  } else if (operator === "∶") {
    const divisor = getRndNum(1, 10);
    const quotient = getRndNum(0, 10);

    firstNum = divisor * quotient;
    secondNum = divisor;
    result = quotient;
  }

  console.log(`firstNum = ${firstNum}`);
  console.log(`secondNum = ${secondNum}`);

  firstNumBox.innerText = firstNum;
  secondNumBox.innerText = secondNum;
}

function showTips(num1, num2, res) {
  const numMax = Math.max(num1, num2);
  const variants = new Set([res]);

  const minLower = Math.max(0, res - numMax);
  const maxLower = res - 1;

  const minUpper = res + 1;
  const maxUpper = res + numMax;

  while (variants.size < 3) {
    let random;

    if (Math.random() < 0.5 && minLower <= maxLower) {
      random = getRndNum(minLower, maxLower);
    } else {
      random = getRndNum(minUpper, maxUpper);
    }

    variants.add(random);
  }

  const tipsArray = shuffle([...variants]);

  tipBoxes.forEach((tip, i) => {
    tip.innerText = tipsArray[i];
  });

  if (tipsContainer.classList.contains("hidden")) {
    tipsContainer.classList.remove("hidden");
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function hideTips() {
  tipBoxes.forEach((tip, i) => {
    if (tip.innerText !== "") {
      tip.innerText = "";
    }
  });

  if (!tipsContainer.classList.contains("hidden")) {
    tipsContainer.classList.add("hidden");
  }
}

function submit() {
  if (inputValue === result) {
    resultBox.style.backgroundColor = "green";

    setTimeout(function () {
      hideTips();
      setUp();

      resultBox.style.backgroundColor = "#e2ebf1";
      input.value = "";
    }, 1000);
  } else {
    input.value = inputValue;
    resultBox.style.backgroundColor = "red";

    setTimeout(() => {
      input.value = "";
      showTips(firstNum, secondNum, result);
    }, 500);
  }
}

input.addEventListener("blur", () => {
  input.focus();
});

input.focus();

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    inputValue = +input.value;
    submit();
  }
});

tipsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("tip")) {
    console.log("clicked", e.target.innerText);
    inputValue = +e.target.innerText;
    input.value = inputValue;
    submit();
  }
});
