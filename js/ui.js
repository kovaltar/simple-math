const btnMenu = document.getElementById("gameMenuToggle");
const btnLang = document.getElementById("langMenuToggle");

const gameMenu = document.getElementById("gameMenu");
const langMenu = document.getElementById("langMenu");

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

