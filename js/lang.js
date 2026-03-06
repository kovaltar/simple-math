import { locales } from "./locales.js";

export const langLabels = {
  en: "EN",
  uk: "UA",
  pl: "PL"
};

// export const langLabels = {
//   en: "🇬🇧 EN ▼",
//   uk: "🇺🇦 UA ▼",
//   pl: "🇵🇱 PL ▼"
// };

let currentLang = "en";

export function  getLang() {
  return currentLang;
}

export function initLang() {
  const userLang = localStorage.getItem("userLanguage");

  if (userLang && locales[userLang]) {
    currentLang = userLang;
    return;
  }

  const browserLangs = navigator.languages || [navigator.language || "en"];

  currentLang =
    browserLangs.map((lang) => lang.split("-")[0]).find((lang) => locales[lang]) || "en";
}

export function setLang(langCode) {
  if (locales[langCode]) {
    currentLang = langCode;
    localStorage.setItem("userLanguage", currentLang);

    return true;
  }

  return false;
}

export function translateText(...elements) {
  document.documentElement.lang = currentLang;

  const dictionary = locales[currentLang];
  const nodes = elements.length
    ? elements
    : document.querySelectorAll('[data-i18n]');

  nodes.forEach(el => {
    const key = el.dataset.i18n;
    const value = getDictProp(dictionary, key);

    if (el.dataset.i18nAttr === 'css-var') {
      el.style.setProperty(el.dataset.cssVar, `"${value}"`);
    } else if (el.dataset.i18nAttr) {
      el.setAttribute(el.dataset.i18nAttr, value);
    } else {
      el.textContent = value;
    }
  });
}

function getDictProp(dictObj, dotpath) {
  return dotpath
    .split('.')
    .reduce((acc, part) => acc?.[part], dictObj) ?? '';
}


export function updateTexts(elements, gameMode) {
  document.documentElement.lang = currentLang;

  const texts = locales[currentLang];
  let solveText = "";
  let nums = "";

  if (gameMode) {
    if (gameMode === "compare") {
    }

    console.log(`gameMode = ${gameMode}`);

    solveText =
      gameMode === "make10" || gameMode === "compare"
        ? ""
        : `${texts.solveTitle}`;
    nums = gameMode === "compare" ? texts.numbers : "";

    elements.gameTitleBox.textContent =
      `${solveText} ${texts.modes[gameMode]} ${nums}`.trim();
  } else {
    elements.gameTitleBox.textContent = texts.modeTitle;
  }

  elements.tipsContainer.style.setProperty(
    "--tips-title",
    `"${texts.chooseAnswer}"`,
  );

  const menuList = elements.menuModeItems;

  Array.prototype.forEach.call(menuList, (menuItem) => {
    const menuItemMode = menuItem.dataset.mode;
    const menuItemText = menuItem.querySelector(".menu__text");

    nums = menuItemMode === "compare" ? texts.numbers : "";
    solveText =
      menuItemMode === "make10" || menuItemMode === "compare"
        ? ""
        : `${texts.solveTitle}`;

    menuItem.dataset.text =
      `${solveText} ${texts.modes[menuItemMode]} ${nums}`.trim();
    menuItemText.textContent = texts.modes[menuItemMode];
    console.log(`menuItem.dataset.text = ${menuItem.dataset.text}`);
  });
}
