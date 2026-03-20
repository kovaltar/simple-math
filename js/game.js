import {
  langLabels,
  getLang,
  initLang,
  setLang,
  translateText,
} from "./lang.js";

const page = document.querySelector(".page");
const btnMenu = document.getElementById("gameMenuToggle");
const btnLang = document.getElementById("langMenuToggle");
const btnSettings = document.getElementById("settingsMenuToggle");
const switcher = document.querySelector(".theme-switcher");

const menuModeItems = document.querySelectorAll(".menu__item--mode");
const langMenuItems = document.querySelectorAll(".menu__item--lang");
const langSettingsItems = document.querySelectorAll(".langs__row");
const rangeSettingsInputs = document.querySelectorAll(".ranges__input");
const makeTargetSettingsRow = document.querySelector(".ranges__row--make");
const makeTargetMenuText = document.querySelectorAll(".menu__text--make10");
const makeTargetSetButtons = document.querySelectorAll(".ranges__button");
const btnResetRanges = document.querySelector(".ranges__row--reset");
let rangesChanged = false;

const gameMenu = document.getElementById("gameMenu");
const langMenu = document.getElementById("langMenu");
const settingsMenu = document.getElementById("settingsMenu");
const settingsGroups = document.querySelectorAll(".settings__group");
const settingsLangMenu = document.querySelector(".langs");
const settingsRangeMenu = document.querySelector(".ranges");

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

const defaultSettings = {
  language: "en",
  theme: "light",
  make10: {
    target: 10,
    range: [1, 9],
  },
  ranges: {
    addition: [0, 10],
    subtraction: [0, 20],
    multiplication: [0, 10],
    division: [1, 10],
  },
};

const settings = {
  get() {
    return JSON.parse(localStorage.getItem("gameSettings") || "{}");
  },

  set(data) {
    localStorage.setItem("gameSettings", JSON.stringify(data));
  },
};

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
    rangeDefault: [0, 10],
    layout: "standard",
    generate: (min, max) => [getRandNum(min, max), getRandNum(min, max)],
    calc: (a, b) => a + b,
  },

  subtraction: {
    operator: "−",
    range: [0, 20],
    rangeDefault: [0, 20],
    layout: "standard",
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
    rangeDefault: [0, 10],
    layout: "standard",
    generate: (min, max) => [getRandNum(min, max), getRandNum(min, max)],
    calc: (a, b) => a * b,
  },

  division: {
    operator: "∶",
    range: [1, 10],
    rangeDefault: [1, 10],
    layout: "standard",
    generate: (min, max) => {
      const result = getRandNum(0, max);
      const divisor = getRandNum(min, max);
      return [result * divisor, divisor];
    },
    calc: (a, b) => a / b,
  },

  compare: {
    operator: "",
    range: [0, 100],
    rangeDefault: [0, 100],
    layout: "compare",
    generate: (min, max) => [getRandNum(min, max), getRandNum(min, max)],
    calc: (a, b) => (a === b ? "=" : a > b ? ">" : "<"),
  },

  make10: {
    target: 10,
    operator: "+",
    range: [1, 9],
    rangeDefault: [1, 9],
    layout: "make10",
    generate(min, max) {
      const a = getRandNum(min, max);
      // return [a, this.target];
      return [a, gameModes.make10.target];
    },
    calc(a, b) {
      return b - a;
    },
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

loadSettings();
syncMakeTargetButtons();
initLang();
translateText();
setActiveLangMenu();
setRangesValues();
makeTargetTitleUpdate();

function saveSettings() {
  settings.set({
    // language: getLang(),
    theme: page.classList.contains("page--theme--dark") ? "dark" : "light",
    make10: {
      target: gameModes.make10.target,
      range: gameModes.make10.range,
    },
    ranges: Object.fromEntries(
      Object.entries(gameModes).map(([mode, config]) => [
        mode,
        [...config.range],
      ]),
    ),
  });

  console.log(JSON.parse(localStorage.gameSettings));
}

// function applyLang(language) {
//   if (!language) {
//     return;
//   }

//   setLang(language);
// }

function applyTheme(theme) {
  if (!theme) return;

  page.classList.toggle("page--theme--dark", theme === "dark");
  switcher.classList.toggle("theme-switcher--theme--dark", theme === "dark");
}

function applyMake10(make10) {
  if (!make10) return;

  gameModes.make10.target =
    make10.target ?? defaultSettings.make10.target;

  if (Array.isArray(make10.range) && make10.range.length === 2) {
    gameModes.make10.range = make10.range;
  }
}

function applyRanges(ranges) {
  if (!ranges) return;

  for (const mode in ranges) {
    if (gameModes[mode]) {
      gameModes[mode].range = ranges[mode];
    }
  }
}

function loadSettings() {
  const savedSettings = settings.get();

  // applyLang(saveSettings.language);
  applyTheme(savedSettings.theme);
  applyMake10(savedSettings.make10);
  applyRanges(savedSettings.ranges);
}

function syncMakeTargetButtons() {
  makeTargetSetButtons.forEach((btn) => {
    const value = +btn.dataset.value;

    btn.classList.toggle("active", value === gameModes.make10.target);
  });
}

function makeTargetTitleUpdate() {
  const target = gameModes.make10.target;
  const mode = gameState.mode;
  const nodes =
    mode === "make10"
      ? [gameTitleBox, ...makeTargetMenuText]
      : [...makeTargetMenuText];

  nodes.forEach((el) => {
    let title = el.textContent;

    title = title.split(" ")[0] + " " + target;
    el.textContent = title;
  });
}

function switchTheme() {
  page.classList.toggle("page--theme--dark");
  switcher.classList.toggle("theme-switcher--theme--dark");
}

switcher.addEventListener("click", () => {
  switchTheme();
  saveSettings();
});

makeTargetSettingsRow.addEventListener("click", (e) => {
  if (!e.target.classList.contains("ranges__button")) {
    return;
  }

  if (!e.target.classList.contains("active")) {
    makeTargetSetButtons.forEach((btn) => {
      deactivate(btn);
    });

    e.target.classList.add("active");

    console.log(+e.target.dataset.value);

    const targetValue = +e.target.dataset.value;
    const targetMode = gameModes.make10;

    targetMode.target = targetValue;
    targetMode.range[1] = targetValue - 1;
    rangesChanged = true;

    makeTargetTitleUpdate();
    saveSettings();
  }
});

settingsGroups.forEach((group) => {
  group.addEventListener("toggle", () => {
    if (!group.open) return;

    settingsGroups.forEach((g) => {
      if (g !== group) g.open = false;
    });
  });
});

function setRangesValues() {
  rangeSettingsInputs.forEach((input) => {
    const inputMode = input.dataset.modename;
    const inputType = input.dataset.typename;

    input.value =
      inputType === "min"
        ? gameModes[inputMode].range[0]
        : gameModes[inputMode].range[1];
  });
}

function resetRanges() {
  Object.values(gameModes).forEach((value) => {
    value.range = [...value.rangeDefault];
  });

  gameModes.make10.target = 10;

  makeTargetSetButtons.forEach((btn) => deactivate(btn));
  makeTargetSetButtons[0].classList.add("active");
  rangesChanged = true;

  setRangesValues();
  saveSettings();
}

rangeSettingsInputs.forEach((input) =>
  input.addEventListener("focus", selectInputText),
);

function selectInputText() {
  this.select();
}

btnResetRanges.addEventListener("click", resetRanges);

function setActiveLangMenu() {
  const lang = getLang();

  const langItems = [...langMenuItems, ...langSettingsItems];

  langItems.forEach((item) => {
    const isActive = item.dataset.lang === lang;

    item.classList.toggle("active", isActive);
    item.toggleAttribute("aria-selected", isActive);
  });

  btnLang.textContent = langLabels[lang];
}

function toggleMenu(menuElement, menuButton) {
  const menus = [gameMenu, langMenu, settingsMenu];
  const buttons = [btnMenu, btnLang, btnSettings];

  menus.forEach((menu, index) => {
    if (menu !== menuElement) {
      const settingsIsOpen =
        menu === settingsMenu && menu.classList.contains("open");

      menu.classList.remove("open");
      buttons[index].setAttribute("aria-expanded", false);

      if (settingsIsOpen) {
        handleSettingsClose();
      }
    } else {
      focusInput();
    }
  });

  const isOpen = menuElement.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);

  if (menuElement === settingsMenu && !isOpen) {
    handleSettingsClose();
  }
}

btnMenu.addEventListener("click", () => {
  toggleMenu(gameMenu, btnMenu);
});

btnLang.addEventListener("click", () => {
  toggleMenu(langMenu, btnLang);
});

btnSettings.addEventListener("click", () => {
  toggleMenu(settingsMenu, btnSettings);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu") && !e.target.closest(".top-bar__btn")) {
    const settingsIsOpen = settingsMenu.classList.contains("open");

    gameMenu.classList.remove("open");
    langMenu.classList.remove("open");
    settingsMenu.classList.remove("open");
    btnMenu.setAttribute("aria-expanded", false);
    btnLang.setAttribute("aria-expanded", false);
    btnSettings.setAttribute("aria-expanded", false);

    if (settingsIsOpen) {
      handleSettingsClose();
    }

    focusInput();
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
  makeTargetTitleUpdate();

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
  const mode = gameState.mode;

  if (setLang(lang)) {
    gameState.lang = lang;

    translateText();
    makeTargetTitleUpdate();
    setActiveLangMenu();
    // saveSettings();
  }

  langMenu.classList.remove("open");
  btnLang.setAttribute("aria-expanded", false);

  focusInput();
}

function handleMenuClick(menu, handler) {
  menu.addEventListener("click", (e) => {
    const menuItem =
      e.target.closest(".menu__item") || e.target.closest(".langs__row");

    if (menuItem) {
      handler(menuItem);
    }
  });
}

function syncRangesFromInputs() {
  rangeSettingsInputs.forEach((input) => {
    const mode = input.dataset.modename;
    const type = input.dataset.typename;

    setValueToRange(mode, type, input.value);
  });

  Object.values(gameModes).forEach((mode) => {
    mode.range.sort((a, b) => a - b);
  });

  setRangesValues();
}

function handleSettingsClose() {
  syncRangesFromInputs();
  saveSettings();

  if (rangesChanged && gameState.mode) {
    setUp();
    console.log(`rangesChanged = ${rangesChanged}`);
  }

  rangesChanged = false;

  console.log("settings close");
}

handleMenuClick(gameMenu, selectMode);
handleMenuClick(startMenu, selectMode);
handleMenuClick(langMenu, selectLang);
handleMenuClick(settingsLangMenu, selectLang);

function setValueToRange(mode, type, value) {
  if (type === "min") {
    gameModes[mode].range[0] = +value;
  } else if (type === "max") {
    gameModes[mode].range[1] = +value;
  }
}

function changeRange(e) {
  const input = e.target.closest(".ranges__input");

  if (!input) {
    return;
  }

  const mode = input.dataset.modename;
  const type = input.dataset.typename;
  const value = input.value;

  setValueToRange(mode, type, value);

  rangesChanged = true;

  console.log(`mode:${mode} type:${type} value:${value}`);
}

settingsRangeMenu.addEventListener("change", changeRange);

function getRandNum(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setUp() {
  setupInput(gameState.mode);

  const { range, generate, calc } = gameModes[gameState.mode];
  const [min, max] = range;

  console.log(`mode: ${gameState.mode}, min = ${min}, max = ${max}`);

  [gameState.firstNum, gameState.secondNum] = generate(min, max);
  gameState.result = calc(gameState.firstNum, gameState.secondNum);

  renderGame();
}

function renderGame() {
  const { mode, firstNum, secondNum } = gameState;
  const { operator, layout } = gameModes[mode];

  setInputBoxStyles("normal");

  firstNumBox.textContent = firstNum;
  secondNumBox.textContent = secondNum;
  equalityBox.classList.remove("hidden");
  resultBox.classList.remove("hidden");
  input.classList.remove("hidden");

  switch (layout) {
    case "compare":
      showTips();
      operatorBox.textContent = "";
      operatorBox.append(input);

      equalityBox.classList.add("hidden");
      resultBox.classList.add("hidden");
      break;

    case "make10":
      operatorBox.textContent = operator;
      secondNumBox.textContent = "";
      secondNumBox.append(input);
      resultBox.textContent = secondNum;
      break;

    case "standard":
    default:
      operatorBox.textContent = operator;
      resultBox.textContent = "";
      resultBox.append(input);
      break;
  }

  input.value = "";
  focusInput();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deactivate(el) {
  if (!el) {
    return;
  }
  el.classList.remove("active");
}

function clearBoxes(nodeList) {
  nodeList.forEach((node) => {
    node.textContent = "";
    deactivate(node);
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

function filterGameInput() {
  if (gameState.mode === "compare") {
    input.value = input.value.replace(/[^<=>]/g, "").slice(0, 1);
  } else {
    input.value = input.value.replace(/[^0-9]/g, "");
  }
}

function filterRangeInput(e) {
  const input = e.target;
  let value = input.value.replace(/[^0-9]/g, "");
  const mode = input.dataset.modename;
  const maxValue = mode === 'multiplication' ? 99 : 1000;

  if (value === "") {
    e.target.value = "";

    return;
  }

  if (Number(value) > maxValue) {
    value = maxValue;
  }

  input.value = value;
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
      tipBoxes.forEach((tip) => deactivate(tip));

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

input.addEventListener("input", filterGameInput);

rangeSettingsInputs.forEach((input) =>
  input.addEventListener("input", filterRangeInput),
);
