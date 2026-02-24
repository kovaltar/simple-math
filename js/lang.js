import { translations } from './translations.js';

let currentLang = 'en';

export function initLang() {
  const browserLangs = navigator.languages || [navigator.language || 'en'];

  for (const lang of browserLangs) {
    const shortLang = lang.split('-')[0];
    if (translations[shortLang]) {
      currentLang = shortLang;
      return;
    }
  }

  currentLang = 'en';
}

export function setLang(langCode) {
  if (!translations[langCode]) return;
  currentLang = langCode;
}

export function getLang() {
  return currentLang;
}

export function updateTexts(elements, gameMode) {
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