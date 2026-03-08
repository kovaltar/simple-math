import {
  langLabels,
  getLang,
  initLang,
  setLang,
  translateText,
} from "./lang.js";

const btnMenu = document.getElementById("gameMenuToggle");
const btnLang = document.getElementById("langMenuToggle");

const menuModeItems = document.querySelectorAll(".menu__item--mode");
const langMenuItems = document.querySelectorAll(".menu__item--lang");

const gameState = {
  mode: null,
  firstNum: null,
  secondNum: null,
  result: null,
  lang: "en",
  inputValue: "",
};

const gameModes = {
  addition: {
    operator: "+",
    range: [0, 10],
    generate: (min, max) => [getRandNum(min, max), getRandNum(min, max)],
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
    generate: (min, max) => [getRandNum(min, max), getRandNum(min, max)],
    calc: (a, b) => a * b,
  },

  division: {
    operator: "∶",
    range: [1, 10],
    generate: (min, max) => {
      const result = getRandNum(0, max);
      const divisor = getRandNum(min, max);
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
    generate: (min, max) => [getRandNum(min, max), getRandNum(min, max)],
    calc: (a, b) => (a === b ? "=" : a > b ? ">" : "<"),
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

const gameMenu = document.getElementById("gameMenu");
const langMenu = document.getElementById("langMenu");

const gameTitleBox = document.querySelector(".game__title");
const gameContainer = document.querySelector(".game__container--play");

const firstNumBox = document.querySelector(".game__box--first");
const operatorBox = document.querySelector(".game__box.game__box--operator");
const secondNumBox = document.querySelector(".game__box--second");
const equalityBox = document.querySelector(".game__box.game__box--equals");
const resultBox = document.querySelector(".game__box--result");
const input = document.querySelector(".game__input");

const tipsContainer = document.querySelector(".game__container--tips");
const tipBoxes = document.querySelectorAll(".game__box--tip");

initLang();
translateText();
setActiveLangMenu();

function setActiveLangMenu() {
  const lang = getLang();

  langMenuItems.forEach((item) => {
    const isActive = item.dataset.lang === lang;

    item.classList.toggle("active", isActive);
    item.toggleAttribute("aria-selected", isActive);
  });

  btnLang.textContent = langLabels[lang];
}

function toggleMenu(menuElement, menuButton) {
  const menus = [gameMenu, langMenu];
  const buttons = [btnMenu, btnLang];

  menus.forEach((menu, index) => {
    if (menu !== menuElement) {
      menu.classList.remove("open");
      buttons[index].setAttribute("aria-expanded", false);
    } else {
      focusInput();
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
    focusInput()
  }
});

function selectMode(menuItem) {
  const mode = menuItem.dataset.mode;

  btnMenu.classList.remove("unvisible");

  menuModeItems.forEach((item) => {
    const activeMode = item.dataset.mode === mode;
    item.classList.toggle("active", activeMode);
    item.toggleAttribute("aria-selected", activeMode);
  });

  gameState.mode = mode;

  gameTitleBox.dataset.i18n = `modes.${mode}.title`;
  translateText(gameTitleBox);

  [gameMenu, startMenu, langMenu].forEach((menu) =>
    menu.classList.remove("open"),
  );
  [btnMenu, btnLang].forEach((btn) => btn.setAttribute("aria-expanded", false));

  gameContainer.classList.remove("hidden");
  hideTips();
  setUp();
}

function selectLang(menuItem) {
  const lang = menuItem.dataset.lang;

  if (setLang(lang)) {
    gameState.lang = lang;
    translateText();
    setActiveLangMenu();
  }

  langMenu.classList.remove("open");
  btnLang.setAttribute("aria-expanded", false);

  focusInput()
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

function setUp() {
  setupInput(gameState.mode);

  const { range, generate, calc } = gameModes[gameState.mode];
  const [min, max] = range;

  [gameState.firstNum, gameState.secondNum] = generate(min, max);
  gameState.result = calc(gameState.firstNum, gameState.secondNum);

  renderGame();
}

function renderGame() {
  const { mode, firstNum, secondNum } = gameState;
  const { operator } = gameModes[mode];

  setInputBoxStyles("normal");

  firstNumBox.textContent = firstNum;
  secondNumBox.textContent = secondNum;

  equalityBox.classList.remove("hidden");
  resultBox.classList.remove("hidden");

  if (mode === "compare") {
    showTips();

    operatorBox.textContent = "";
    operatorBox.append(input);

    equalityBox.classList.add("hidden");
    resultBox.classList.add("hidden");
  } else {
    operatorBox.textContent = operator;

    if (mode === "make10") {
      secondNumBox.textContent = "";
      secondNumBox.append(input);
      resultBox.textContent = secondNum;
    } else {
      resultBox.textContent = "";
      resultBox.append(input);
    }
  }

  input.value = "";
  input.classList.remove("hidden");

  focusInput();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clearTipActive(tip) {
  if (!tip) { return; };
  tip.classList.remove("active");
}

function clearBoxes(nodeList) {
  nodeList.forEach((node) => {
    node.textContent = "";
    clearTipActive(node);
  });
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

function hideTips() {
  clearBoxes(tipBoxes);

  if (!tipsContainer.classList.contains("hidden")) {
    tipsContainer.classList.add("hidden");
  }
}

function setInputBoxStyles(state) {
  const box = input.parentNode;

  if (!box.classList.contains("game__box")) return;

  box.classList.remove("game__box--wrong", "game__box--correct");

  if (state !== "normal") {
    box.classList.add(`game__box--${state}`);
  }
}

function setupInput(mode) {
  const config = inputConfig[mode] || inputConfig.default;
  input.inputMode = config.inputMode;
  input.pattern = config.pattern;
}

function filterInput() {
  if (gameState.mode === "compare") {
    input.value = input.value.replace(/[^<=>]/g, "").slice(0, 1);
  } else {
    input.value = input.value.replace(/[^0-9]/g, "");
  }
}

function focusInput() {
  const { mode } = gameState;

  if (mode && mode !== "compare") {
    requestAnimationFrame(() => input.focus());
  }
}

function submit() {
  if (gameState.inputValue === gameState.result) {
    setInputBoxStyles("correct");

    setTimeout(function () {
      hideTips();
      setUp();
      setInputBoxStyles("normal");

      input.value = "";
    }, 1000);
  } else {
    input.value = gameState.inputValue;

    setInputBoxStyles("wrong");

    setTimeout(() => {
      input.value = "";
      tipBoxes.forEach(tip => clearTipActive(tip));

      if (gameState.mode !== "compare") {
        showTips(gameState.firstNum, gameState.secondNum, gameState.result);
      }
    }, 500);
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    gameState.inputValue =
      gameState.mode === "compare" ? input.value : +input.value;
    submit();
  }
});

tipsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("game__box--tip")) {
    e.target.classList.add("active");
    const iv = e.target.textContent;
    gameState.inputValue = gameState.mode === "compare" ? iv : +iv;
    input.value = gameState.inputValue;
    submit();
  }
});

input.addEventListener("input", filterInput);
