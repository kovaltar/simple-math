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
