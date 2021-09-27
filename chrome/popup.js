const buttonAbout = document.querySelector("#about");
const buttonBlockOption = document.querySelector("#options");
const buttonFavorite = document.querySelector("#favorite");
const buttonJDCookie = document.querySelector("#jdcookie");




function onclickButtonAbout(event1) {
    window.open('https://github.com/jinwyp/tgfcerblock');
}

function onclickButtonBlockOption(event1) {
    // console.log(chrome.runtime.openOptionsPage)
    if (chrome.runtime.openOptionsPage && false) {
        chrome.runtime.openOptionsPage(() => { console.log("Chrome Extension Open Options page") });;
    } else {
        window.open(chrome.runtime.getURL('tab_options.html'));
    }
}

function onclickButtonFavorite(event1) {
    window.open(chrome.runtime.getURL('tab_favorite.html'));
}



function onclickButtonJDCookieShow(event1) {
    // console.log("Good !")
    alert('Good !')
}


buttonBlockOption.addEventListener('click', onclickButtonBlockOption, false);
buttonFavorite.addEventListener('click', onclickButtonFavorite, false);
buttonAbout.addEventListener('click', onclickButtonAbout, false);
buttonJDCookie.addEventListener('click', onclickButtonJDCookieShow, false);