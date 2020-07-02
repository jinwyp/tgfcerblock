

const buttonOption = document.querySelector("#options");

function onclickButtonOption(event1) {
    // console.log(chrome.runtime.openOptionsPage)
    if (chrome.runtime.openOptionsPage && false) {
        chrome.runtime.openOptionsPage(()=>{console.log("Chrome Extension Open Options page")});;
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}


buttonOption.addEventListener('click', onclickButtonOption, false);