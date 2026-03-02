import { updateTexts } from "./lang.js";
import { initLang } from "./lang.js";
import { setLang } from "./lang.js";

const btnMenu = document.getElementById("gameMenuToggle");
const btnLang = document.getElementById("langMenuToggle");

const menuModeItems = document.querySelectorAll(".menu__item.menu__item--mode");

const gameModes = {
  addition: {
    operator: "+",
    range: [0, 10],
    generate: (min, max) => [
      getRandNum(min, max),
      getRandNum(min, max),
    ],
    calc: (a, b) => a + b,
  },

  subtraction: {
    operator: "−",
    range: [0, 20],
    generate: (min, max) => {
      const a = getRandNum(min, max);
      const b = getRandNum(min, max);
      return [Math.max(a, b), Math.min(a, b)];
    },
    calc: (a, b) => a - b,
  },

  multiplication: {
    operator: "·",
    range: [0, 10],
    generate: (min, max) => [
      getRandNum(min, max),
      getRandNum(min, max),
    ],
    calc: (a, b) => a * b,
  },

  division: {
    operator: "∶",
    range: [1, 10],
    generate: (min, max) => {
      const result = getRandNum(0, max); // дозволяємо 0
      const divisor = getRandNum(min, max); // ≠ 0
      return [result * divisor, divisor];
    },
    calc: (a, b) => a / b,
  },

  make10: {
    operator: "+",
    range: [1, 9],
    generate: (min, max) => {
      const a = getRandNum(min, max);
      return [a, 10];
    },
    calc: (a, b) => b - a,
  },

  compare: {
    operator: "",
    range: [0, 100],
    generate: (min, max) => [
      getRandNum(min, max),
      getRandNum(min, max),
    ],
    calc: (a, b) =>
      a === b ? "=" : a > b ? ">" : "<",
  },
};

const inputConfig = {
  compare: {
    inputMode: "text",
    pattern: "^[><=]$",
  },
  default: {
    inputMode: "numeric",
    pattern: "^\\d+$",
  },
};

// const gameModes = {
//   addition: { operator: "+", range: [0, 10] },
//   subtraction: { operator: "−", range: [0, 20] },
//   multiplication: { operator: "·", range: [0, 10] },
//   division: { operator: "∶", range: [1, 10] },
//   make10: { operator: "+", range: [1, 9] },
//   compare: { operator: "", range: [0, 100] },
// };

let mode = null;
let range = null;
let operator = null;
let modeText = null;
let lang = null;

const gameMenu = document.getElementById("gameMenu");
const langMenu = document.getElementById("langMenu");

const gameTitleBox = document.querySelector(".game__title");
const gameContainer = document.querySelector(".game__container--play");

const firstNumBox = document.querySelector(".game__box--first");
const secondNumBox = document.querySelector(".game__box--second");

let firstNum = 0;
let secondNum = 0;
let result = 0;

const operatorBox = document.querySelector(".game__box.game__box--operator");
const equalityBox = document.querySelector(".game__box.game__box--equals");
const resultBox = document.querySelector(".game__box--result");
const input = document.querySelector(".game__input");

let inputValue = null;
const tipsContainer = document.querySelector(".game__container--tips");
const tipBoxes = document.querySelectorAll(".game__box--tip");

const langChangeElements = {
  gameTitleBox,
  tipsContainer,
  menuModeItems,
};

initLang();
updateTexts(langChangeElements, mode);

function toggleMenu(menuElement, menuButton) {
  const menus = [gameMenu, langMenu];
  const buttons = [btnMenu, btnLang];

  menus.forEach((menu, index) => {
    if (menu !== menuElement) {
      menu.classList.remove("open");
      buttons[index].setAttribute("aria-expanded", false);
    } else {
      if (!gameContainer.classList.contains("hidden")) {
        requestAnimationFrame(() => input.focus());
      }
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
    if (!gameContainer.classList.contains("hidden")) {
      requestAnimationFrame(() => input.focus());
    }
  }
});

function selectMode(menuItem) {
  menuItem.classList.add("active");
  mode = menuItem.dataset.mode;
  modeText = menuItem.dataset.text;

  if (mode !== "compare") {
    operator = gameModes[mode].operator;
    operatorBox.textContent = operator;
  }
  gameTitleBox.textContent = modeText;

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

  setLang(lang);

  updateTexts(langChangeElements, mode);

  langMenu.classList.remove("open");
  btnLang.setAttribute("aria-expanded", false);

  requestAnimationFrame(() => {
    input.focus();
  });
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

function getRandNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearBoxes(nodeList) {
  nodeList.forEach((node, i) => {
    if (node.textContent !== "") {
      node.textContent = "";
      node.style.transform = "scale(1.0)";
      node.style.backgroundColor = "#dbeafe";
    }
  });
}

// function setUp() {
//   setupInput(mode);

//   range = gameModes[mode].range;
//   const [minNum, maxNum] = range;
//   let num1 = getRandNum(minNum, maxNum);
//   let num2 =
//     mode === "division"
//       ? getRandNum(minNum - 1, maxNum)
//       : getRandNum(minNum, maxNum);

//   if (mode === "addition") {
//     firstNum = num1;
//     secondNum = num2;
//     result = firstNum + secondNum;
//   } else if (mode === "multiplication") {
//     firstNum = num1;
//     secondNum = num2;
//     result = firstNum * secondNum;
//   } else if (mode === "subtraction") {
//     firstNum = Math.max(num1, num2);
//     secondNum = Math.min(num1, num2);
//     result = firstNum - secondNum;
//   } else if (mode === "division") {
//     firstNum = num1 * num2;
//     secondNum = num2;
//     result = num1;
//   } else if (mode === "make10") {
//     firstNum = num1;
//     secondNum = 10;
//     result = 10 - firstNum;
//   } else if (mode === "compare") {
//     firstNum = num1;
//     secondNum = num2;
//     const delta = firstNum - secondNum;
//     result = delta === 0 ? "=" : delta > 0 ? ">" : "<";
//   }

//   if (mode === "compare") {
//     showTips();
//     firstNumBox.textContent = firstNum;
//     secondNumBox.textContent = secondNum;
//     operatorBox.textContent = "";
//     operatorBox.append(input);
//     equalityBox.classList.add("hidden");
//     resultBox.classList.add("hidden");
//   } else {
//     equalityBox.classList.remove("hidden");
//     resultBox.classList.remove("hidden");

//     if (mode === "make10") {
//       secondNumBox.textContent = "";
//       secondNumBox.append(input);
//       firstNumBox.textContent = firstNum;
//       resultBox.textContent = secondNum;
//     } else {
//       resultBox.textContent = "";
//       resultBox.append(input);
//       firstNumBox.textContent = firstNum;
//       secondNumBox.textContent = secondNum;
//     }
//   }

//   stylizeInputBox("normal");

//   input.classList.remove("hidden");
//   requestAnimationFrame(() => {
//     input.focus();
//   });
// }

function setUp() {
  setupInput(mode);

  const { operator, range, generate, calc } = gameModes[mode];
  const [min, max] = range;

  operatorBox.textContent = operator;

  [firstNum, secondNum] = generate(min, max);
  result = calc(firstNum, secondNum);

  renderGame();
}

function renderGame() {
  firstNumBox.textContent = firstNum;
  secondNumBox.textContent = secondNum;

  if (mode === "compare") {
    showTips();
    operatorBox.append(input);
    equalityBox.classList.add("hidden");
    resultBox.classList.add("hidden");
  } else {
    equalityBox.classList.remove("hidden");
    resultBox.classList.remove("hidden");
    resultBox.textContent = "";
    resultBox.append(input);
  }

  stylizeInputBox("normal");
  input.value = "";
  input.classList.remove("hidden");

  requestAnimationFrame(() => input.focus());
}

function showTips(num1, num2, res) {
  clearBoxes(tipBoxes);

  let tipsArray = [];

  if (arguments.length) {
    const numMax = Math.max(num1, num2);
    const variants = new Set([res]);

    const minLower = Math.max(0, res - numMax);
    const maxLower = res - 1;

    const minUpper = res + 1;
    const maxUpper = res + numMax;

    while (variants.size < 3) {
      let random;

      if (Math.random() < 0.5 && minLower <= maxLower) {
        random = getRandNum(minLower, maxLower);
      } else {
        random = getRandNum(minUpper, maxUpper);
      }

      variants.add(random);
    }

    tipsArray = shuffle([...variants]);
  } else {
    tipsArray = ["<", "=", ">"];
  }

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

// function setupInput(mode) {
//   if (mode !== "compare") {
//     input.inputMode = "numeric";
//     input.pattern = "^\\d+$";
//   } else {
//     input.inputMode = "text";
//     input.pattern = "^[><=]$";
//   }
// }

function setupInput(mode) {
  const config = inputConfig[mode] || inputConfig.default;
  input.inputMode = config.inputMode;
  input.pattern = config.pattern;
}

function filterInput() {
  if (mode === "compare") {
    input.value = input.value.replace(/[^<=>]/g, "").slice(0, 1);
  } else {
    input.value = input.value.replace(/[^0-9]/g, "");
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

      if (mode !== "compare") {
        showTips(firstNum, secondNum, result);
      }
    }, 500);
  }
}

input.focus();

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    inputValue = mode === "compare" ? input.value : +input.value;
    submit();
  }
});

tipsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("game__box--tip")) {
    const iv = e.target.textContent;
    inputValue = mode === "compare" ? iv : +iv;
    input.value = inputValue;
    submit();
  }
});

input.addEventListener("input", filterInput);

// input.addEventListener("input", () => {
//   if (mode === "compare") {
//     input.value = input.value.replace(/[^<=>]/g, "").slice(0, 1);
//   } else {
//     input.value = input.value.replace(/[^0-9]/g, "");
//   }
// });
