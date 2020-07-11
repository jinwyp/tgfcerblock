


// console.log("Chrome Extension background script running!")


/*
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("request: ", request)
    console.log("sender: ", sender)
    console.log("sendResponse: ", sendResponse)

    sendResponse({test:'test'})
})



chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: 'popup.html'})

    chrome.runtime.openOptionsPage(()=>{console.log("Chrome Extension Open Options page")});
});



chrome.tabs.onActivated.addListener(  (currentTab) => {
    chrome.tabs.get(currentTab.tabId, ( currentTabInfo) => {
        console.log("currentTabInfo: ", currentTabInfo.url);

        const regex1 = /^https:\/\/club\.tgfcer\.com\/thread/;
        const regex2 = /^https:\/\/wap.tgfcer.com\/index.php\?action=thread/;

        console.log(regex1.test(currentTabInfo.url));
        if (regex1.test(currentTabInfo.url) || regex2.test(currentTabInfo.url)) {

            chrome.tabs.executeScript(null,{
                file: "./content.js"
            }, ()=> {console.log("Chrome Extension Script Inject Programmatically! ")});

        }
    })

})


*/


