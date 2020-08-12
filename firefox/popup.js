const buttonAbout = document.querySelector("#about");
const buttonBlockOption = document.querySelector("#options");
const buttonFavorite = document.querySelector("#favorite");

function onclickButtonBlockOption(event1) {
    // console.log(browser.runtime.openOptionsPage)
    window.open(browser.runtime.getURL('options.html'));
}

function onclickButtonFavorite(event1) {
    window.open(browser.runtime.getURL('favorite.html'));
}

function onclickButtonAbout(event1) {
    window.open('https://github.com/jinwyp/tgfcerblock');
}

buttonBlockOption.addEventListener('click', onclickButtonBlockOption, false);
buttonFavorite.addEventListener('click', onclickButtonFavorite, false);
buttonAbout.addEventListener('click', onclickButtonAbout, false);