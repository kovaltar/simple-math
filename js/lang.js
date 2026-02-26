import { translations } from './translations.js';

let currentLang = 'en';

export function initLang() {
  const userLang = localStorage.getItem('userLanguage');

  if (userLang && translations[userLang]) {
    currentLang = userLang;
    return;
  }
  
  const browserLangs = navigator.languages || [navigator.language || 'en'];

  currentLang =
    browserLangs
      .map(l => l.split('-')[0])
      .find(l => translations[l]) || 'en';
}

export function setLang(langCode) {
  if (translations[langCode]) {
    currentLang = langCode;
    localStorage.setItem('userLanguage', currentLang);

    return true;
  }

  return false;
}

export function updateTexts(elements, gameMode) {
  document.documentElement.lang = currentLang;
  
  const texts = translations[currentLang];
  let solveText = '';
 
  if (gameMode) {
    solveText = gameMode === 'make10' ? '' : `${texts.solveTitle} `;
    elements.gameTitleBox.textContent = `${solveText}${texts.modes[gameMode]}`;
  } else {
    elements.gameTitleBox.textContent = texts.modeTitle;
  }

  elements.tipsContainer.style.setProperty(
    '--tips-title',
    `"${texts.chooseAnswer}"`
  );

  const menuList = elements.menuModeItems;

  Array.prototype.forEach.call(menuList, menuItem => {
    const menuItemMode = menuItem.dataset.mode;
    const menuItemText = menuItem.querySelector('.menu__text');
    solveText = menuItemMode === 'make10' ? '' : `${texts.solveTitle} `;

    menuItem.dataset.text = `${solveText}${texts.modes[menuItemMode]}`;
    menuItemText.textContent = texts.modes[menuItemMode];
    console.log(`menuItem.dataset.text = ${menuItem.dataset.text}`);
  });
}