const btnMenu = document.getElementById("gameMenuToggle");
const btnLang = document.getElementById("langMenuToggle");
const menuItems = document.querySelectorAll(".menu__item");

const gameModes = {
  addition: "+",
  subtraction: "−",
  multiplication: "·",
  division: "∶",
  make10: "+",
};
let mode = null;
let modeValue = null;
let modeText = null;
let lang = null;

const gameMenu = document.getElementById("gameMenu");
const langMenu = document.getElementById("langMenu");

const startDescriptionBox = document.querySelector(".game__start-title");
const gameContainer = document.querySelector(".game__container--play");

const firstNumBox = document.querySelector(".game__box--first");
const secondNumBox = document.querySelector(".game__box--second");

let firstNum = 0;
let secondNum = 0;
let result = 0;

const operatorBox = document.querySelector(".game__box.game__box--operator");

const resultBox = document.querySelector(".game__box--result");
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

btnMenu.addEventListener("click", () => {
  toggleMenu(gameMenu, btnMenu);
});
btnLang.addEventListener("click", () => {
  toggleMenu(langMenu, btnLang);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu") && !e.target.closest(".top-bar__btn")) {
    gameMenu.classList.remove("open");
    langMenu.classList.remove("open");
    btnMenu.setAttribute("aria-expanded", false);
    btnLang.setAttribute("aria-expanded", false);
  }
});

function selectMode(menuItem) {
  menuItem.classList.add("active");
  mode = menuItem.dataset.mode;
  modeText = menuItem.dataset.text;
  modeValue = gameModes[mode];

  operatorBox.textContent = modeValue;
  startDescriptionBox.textContent = modeText;

  gameMenu.classList.remove("open");
  startMenu.classList.remove("open");
  langMenu.classList.remove("open");

  btnMenu.setAttribute("aria-expanded", false);
  btnLang.setAttribute("aria-expanded", false);

  gameContainer.classList.remove("hidden");
  hideTips();
  setUp();
}

function selectLang(menuItem) {
  menuItem.classList.add("active");
  lang = menuItem.dataset.lang;
  langMenu.classList.remove("open");
  btnLang.setAttribute("aria-expanded", false);

  console.log(`lang = ${lang}`);

  return;
}

gameMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".menu__item");
  if (!item) return;

  selectMode(item);
});

startMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".menu__item");
  if (!item) return;

  selectMode(item);
});

langMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".menu__item");
  if (!item) return;

  selectLang(item);
});

function getRndNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearBoxes(nodeList) {
  nodeList.forEach((node, i) => {
    if (node.textContent !== "") {
      node.textContent = "";
      node.style.transform = 'scale(1.0)';
      node.style.backgroundColor = '#dbeafe';
    }
  });
}

function setUp() {
  let num1 = getRndNum();
  let num2 = getRndNum();

  stylizeInputBox("normal");

  if (mode === "addition") {
    firstNum = num1;
    secondNum = num2;
    result = firstNum + secondNum;
  } else if (mode === "multiplication") {
    firstNum = num1;
    secondNum = num2;
    result = firstNum * secondNum;
  } else if (mode === "subtraction") {
    num1 = getRndNum(0, 20);
    num2 = getRndNum(0, 20);
    firstNum = Math.max(num1, num2);
    secondNum = Math.min(num1, num2);
    result = firstNum - secondNum;
  } else if (mode === "division") {
    const divisor = getRndNum(1, 10);
    const quotient = getRndNum(0, 10);

    firstNum = divisor * quotient;
    secondNum = divisor;
    result = quotient;
  } else if (mode === "make10") {
    firstNum = getRndNum(1, 9);
    secondNum = 10;
    result = 10 - firstNum;
  }

  if (mode === "make10") {
    secondNumBox.textContent = "";
    secondNumBox.append(input);
    firstNumBox.textContent = firstNum;
    resultBox.textContent = secondNum;
  } else {
    resultBox.textContent = "";
    resultBox.append(input);
    firstNumBox.textContent = firstNum;
    secondNumBox.textContent = secondNum;
  }

  input.classList.remove("hidden");
  requestAnimationFrame(() => {
    input.focus();
  });
}

function showTips(num1, num2, res) {
  clearBoxes(tipBoxes);

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
    tip.textContent = tipsArray[i];
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
  clearBoxes(tipBoxes);

  if (!tipsContainer.classList.contains("hidden")) {
    tipsContainer.classList.add("hidden");
  }
}

function stylizeInputBox(condition) {
  const box = input.parentNode;

  if (box !== gameContainer) {
    switch (condition) {
      case "normal":
        box.style.backgroundColor = "#FFFFFF";
        box.style.borderColor = "#bfdbfe";
        box.style.color = "#1e3a8a";
        break;
      case "correct":
        box.style.backgroundColor = "#bbf7d0";
        box.style.borderColor = "#22c55e";
        box.style.color = "#166534";
        break;
      case "wrong":
        box.style.backgroundColor = "#fecaca";
        box.style.borderColor = "#ef4444";
        box.style.color = "#7f1d1d";
        break;
      default:
        return;
    }
  }
}

function submit() {
  if (inputValue === result) {
    stylizeInputBox("correct");

    setTimeout(function () {
      hideTips();
      setUp();
      stylizeInputBox("normal");

      input.value = "";
    }, 1000);
  } else {
    input.value = inputValue;

    stylizeInputBox("wrong");

    setTimeout(() => {
      input.value = "";
      showTips(firstNum, secondNum, result);
    }, 500);
  }
}

input.focus();

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    inputValue = +input.value;
    submit();
  }
});

tipsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("game__box--tip")) {
    inputValue = +e.target.textContent;
    input.value = inputValue;
    submit();
  }
});

input.addEventListener("input", () => {
  input.value = input.value.replace(/[^0-9]/g, "");
});
