const btnMenu = document.getElementById("gameMenuToggle");
const btnLang = document.getElementById("langMenuToggle");
const menuItems = document.querySelectorAll('.menu__item');


const gameModes = {
  addition: "+",
  subtraction: "−",
  multiplication: "·",
  division: "∶",
  make10: 'make10',
};
let mode = null;
let modeValue = null;
let modeText = null;

const gameMenu = document.getElementById("gameMenu");
const langMenu = document.getElementById("langMenu");

const startDescriptionBox = document.querySelector('.game__start-title');
const gameContainer = document.querySelector('.game__container--play');

const firstNumBox = document.querySelector(".game__box--first");
const secondNumBox = document.querySelector(".game__box--second");

let firstNum = 0;
let secondNum = 0;
let result = 0;

const operatorBox = document.querySelector('.game__box.game__box--operator');

const resultBox = document.querySelector(".game__box--result");

const inputHtml = `
<input
  class="game__input hidden resfield"
  name="resfield"
  type="tel"
  inputmode="numeric"
  autofocus
/>
`;
const input = document.querySelector(".game__input");

let inputValue = null;
const tipsContainer = document.querySelector(".game__container--tips");
const tipBoxes = document.querySelectorAll(".game__box--tip");
let arrForTips;
const tips = [];

function toggleMenu(menuElement, menuButton) {
  const menus = [gameMenu, langMenu];
  const buttons = [btnMenu, btnLang];

  menus.forEach((menu, index) => {
    if (menu !== menuElement) {
      menu.classList.remove("open");
      buttons[index].setAttribute("aria-expanded", false);
    }
  });

  const isOpen = menuElement.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
}

btnMenu.addEventListener("click", () => { toggleMenu(gameMenu, btnMenu); });
btnLang.addEventListener("click", () => { toggleMenu(langMenu, btnLang); });

document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu") && !e.target.closest(".top-bar__btn")) {
    gameMenu.classList.remove("open");
    langMenu.classList.remove("open");
    btnMenu.setAttribute("aria-expanded", false);
    btnLang.setAttribute("aria-expanded", false);
  }
});


menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", () => {
    menuItem.classList.add("active");
    mode = menuItem.dataset.mode;
    modeText = menuItem.dataset.text;
    modeValue = gameModes[mode];
    // console.log(`modeValue = ${modeValue}`);
    operatorBox.innerText = modeValue;
    startDescriptionBox.innerText = modeText;
    gameMenu.classList.remove("open");
    startMenu.classList.remove("open");
    btnMenu.setAttribute("aria-expanded", false);
    gameContainer.classList.remove('hidden');
    hideTips();
    setUp();
  });
});

function getRndNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setUp() {
  let num1 = getRndNum();
  let num2 = getRndNum();
  // console.log(`num1 = ${num1}`);
  // console.log(`num2 = ${num2}`);
  const operator = modeValue;

  // console.log(`operator = ${operator}`);

  resultBox.append(input);
  input.classList.remove('hidden');

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

  // console.log(`firstNum = ${firstNum}`);
  // console.log(`secondNum = ${secondNum}`);

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
    resultBox.style.backgroundColor = "#bbf7d0";
    resultBox.style.borderColor = "#22c55e";
    resultBox.style.color = "#166534";

    setTimeout(function () {
      hideTips();
      setUp();

      resultBox.style.backgroundColor = "#FFFFFF";
      resultBox.style.borderColor = "#bfdbfe";
      resultBox.style.color = "#1e3a8a";
      input.value = "";
    }, 1000);
  } else {
    input.value = inputValue;
    resultBox.style.backgroundColor = "#fecaca";
    resultBox.style.borderColor = "#ef4444";
    resultBox.style.color = "#7f1d1d";

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
  if (e.target.classList.contains("game__box--tip")) {
    // console.log("clicked", e.target.innerText);
    inputValue = +e.target.innerText;
    input.value = inputValue;
    submit();
  }
});