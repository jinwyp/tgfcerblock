window.bears = {}



// console.log("Chrome Extension background script running!")


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // window.bears[request.url] = request.count
})



// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
    // chrome.tabs.create({url: 'popup.html'})

    // chrome.runtime.openOptionsPage(()=>{console.log("Chrome Extension Open Options page")});
});



chrome.tabs.onActivated.addListener(  (currentTab) => {
    /*
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
    */

})



