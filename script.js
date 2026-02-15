const firstNumBox = document.querySelector(".firstnum");
const secondNumBox = document.querySelector(".secondnum");
const mathActionBox = document.querySelector(".math-action");
const resultBox = document.querySelector(".result");
const input = document.querySelector(".resfield");
let inputValue = null;
const mathActions = { add: "+", sub: "-", mul: "·", div: ":" };
let mathActionValue = mathActions.mul;
const tipsContainer = document.querySelector(".tips");
const tipBoxes = document.querySelectorAll(".tip");
const tips = [];

mathActionBox.innerText = mathActionValue;

function getRndNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillTips(res, num1, num2) {
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
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clearTips() {
  tipBoxes.forEach((tip, i) => {
    if (tip.innerText !== "") {
      tip.innerText = "";
    }
  });
}

function submit() {
  console.log(`inputValue = ${inputValue}`);

  if (inputValue === result) {
    resultBox.style.backgroundColor = "green";

    setTimeout(function () {
      clearTips();

      if (!tipsContainer.classList.contains("hidden")) {
        tipsContainer.classList.add("hidden");
      }
      firstNum = getRndNum();
      secondNum = getRndNum();
      firstNumBox.innerText = firstNum;
      secondNumBox.innerText = secondNum;
      resultBox.style.backgroundColor = "#edf8f8";
      result = firstNum * secondNum;
      input.value = "";
    }, 1000);
  } else {
    input.value = inputValue;
    resultBox.style.backgroundColor = "red";

    setTimeout(() => {
      if (tipsContainer.classList.contains("hidden")) {
        tipsContainer.classList.remove("hidden");
      }
      input.value = "";
      fillTips(result, firstNum, secondNum);
    }, 500);
  }
}

let firstNum = getRndNum();
let secondNum = getRndNum();
let result = firstNum * secondNum;

console.log(`result = ${result}`);

console.log(firstNumBox);
firstNumBox.innerText = firstNum;
secondNumBox.innerText = secondNum;

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
