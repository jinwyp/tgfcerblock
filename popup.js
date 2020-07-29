

const buttonAbout = document.querySelector("#about");
const buttonBlockOption = document.querySelector("#options");
const buttonFavorite = document.querySelector("#favorite");

function onclickButtonBlockOption(event1) {
    // console.log(chrome.runtime.openOptionsPage)
    if (chrome.runtime.openOptionsPage && false) {
        chrome.runtime.openOptionsPage(()=>{console.log("Chrome Extension Open Options page")});;
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}

function onclickButtonFavorite(event1) {
    window.open(chrome.runtime.getURL('favorite.html'));
}

function onclickButtonAbout(event1) {
    window.open('https://github.com/jinwyp/tgfcerblock');
}

buttonBlockOption.addEventListener('click', onclickButtonBlockOption, false);
buttonFavorite.addEventListener('click', onclickButtonFavorite, false);
buttonAbout.addEventListener('click', onclickButtonAbout, false);

