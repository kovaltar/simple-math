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
  let nums = '';
 
  if (gameMode) {
    if (gameMode === 'compare') {

    }

    console.log(`gameMode = ${gameMode}`);

    solveText = (gameMode === 'make10' || gameMode === 'compare') ? '' : `${texts.solveTitle}`;
    nums = gameMode === 'compare' ? texts.numbers : '';

    elements.gameTitleBox.textContent = `${solveText} ${texts.modes[gameMode]} ${nums}`.trim();
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

    nums = menuItemMode === 'compare' ? texts.numbers : '';
    solveText = (menuItemMode === 'make10' || menuItemMode === 'compare') ? '' : `${texts.solveTitle}`;

    menuItem.dataset.text = `${solveText} ${texts.modes[menuItemMode]} ${nums}`.trim();
    menuItemText.textContent = texts.modes[menuItemMode];
    console.log(`menuItem.dataset.text = ${menuItem.dataset.text}`);
  });
}