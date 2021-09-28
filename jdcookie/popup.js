const buttonSearchElement = document.querySelector("#btn-search");
const textSearchElement = document.querySelector("#input-searchtext");

const divListContent = document.querySelector("#cookie-list");
const spanContentPtKeyAndPin = document.querySelector("#jd_pt_key_pin");
const spanContentPtKey = document.querySelector("#jd_pt_key");
const spanContentPtPin = document.querySelector("#jd_pt_pin");


const isDebug = false;
let apiPrefix = isDebug ? 'http://localhost:8088' : 'http://tgfcer.jscool.net'
let currentUsername = '';
let currentUserId = '';
let jdDomain = 'https://home.m.jd.com';






// Chrome API Function 

async function chromeGetCurrentTab() {

    let queryOptions = { active: true, currentWindow: true }
    let tabList = await chrome.tabs.query(queryOptions)
    let [tab] = tabList

    console.log("currentTabList: ", tabList);
    console.log("currentTab: ", tab);
    return tab;
}




async function chromeGetAllCookies(domain) {

    let tempCookieList = await chrome.cookies.getAll({ domain: domain })

    console.log("===== chromeGetAllCookies ====== ")
        // console.log(tempCookieList);

    let stringCookie = ''
    let objectCookie = {}

    if (tempCookieList.length > 0) {

        for (var i = 0; i < tempCookieList.length; i++) {
            let tempOneCookie = tempCookieList[i]
            if (tempOneCookie.name) {
                stringCookie = stringCookie + tempOneCookie.name + "=" + tempOneCookie.value + "; ";
                objectCookie[tempOneCookie.name] = tempOneCookie.value
            }
        }
    }

    return {
        stringCookie,
        objectCookie,
        arrayCookie: tempCookieList
    }

}





// Tools function

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const letter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getToken(lengthNumber) {

    let resultIndex = getRandomInt(1, lengthNumber - 1);
    let resultString = '';

    for (let i = 0; i < lengthNumber; i++) {
        if (i === resultIndex) {
            resultString = resultString + 'jin'
        }
        resultString = resultString + letter[getRandomInt(0, 51)]
    }

    return resultString
}


function fallbackCopyTextToClipboard(text) {

    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        alert("Already copy To Clipboard! ")
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}


function getDomainFromUrl(url) {
    var domain = {
        subDomain: '',
        domainWithHttps: '',
        domain: ''
    }

    var tempUrl = url.replace(/(https?:\/\/)?(www.)?/i, '');
    console.log("tempUrl: ", tempUrl)

    var urlArray = url.split("/");

    var domainArray = urlArray[2].split('.');
    var tempDomain = domainArray.slice(domainArray.length - 2).join('.');


    domain.subDomain = urlArray[0] + '//' + urlArray[2]
    domain.domainWithHttps = urlArray[0] + '//' + tempDomain
    domain.domain = tempDomain


    console.log("domainArray : ", domainArray);
    console.log("tempDomain : ", tempDomain);

    console.log("urlArray : ", urlArray);
    console.log("currentTabDomain : ", domain);


    return domain

}





// Chrome Storage function


function saveUserFavoriteLinkListToSyncStorage(linkList) {
    if (linkList && Array.isArray(linkList)) {
        const linkListTemp = linkList.map(link => {
            return link.threadId
        })
        chrome.storage.sync.set({ tgfcerUserFavoriteLinkIdList: linkListTemp }, function() {
            console.log('Chrome Sync storage saved data: ', linkListTemp)
        })
    }
}

function getChromeData() {
    chrome.storage.sync.get(null, function(result) {
        console.log(`===== Chrome.storage get currently is `, result);

        if (result) {
            // callback (null, result[key])
            currentUsername = result.tgfcerCurrentUsername || '';
            currentUserId = result.tgfcerCurrentUserId || '';
        }
    });
}





// User Feature Function

let liCounter = 1;

function clearList() {
    divListContent.innerHTML = '';
}

function appendList(text) {

    var li = document.createElement("li");
    li.setAttribute("id", "element_" + liCounter);
    li.appendChild(document.createTextNode(text));
    li.classList.add("list-group-item");
    divListContent.appendChild(li);
    liCounter = liCounter + 1
}

function modifyText(node, text) {
    node.textContent = text;
}





let allCookies = {
    stringCookie: '',
    objectCookie: {},
    arrayCookie: []
}




async function showCookieList(list) {
    let inputFilterText = document.querySelector("#input-searchtext").value

    if (list.arrayCookie.length > 0) {

        clearList();
        if (inputFilterText) {
            list.arrayCookie.forEach((tempOneCookie) => {
                if (tempOneCookie.name && tempOneCookie.name.indexOf(inputFilterText) > -1) {
                    appendList(tempOneCookie.name + "=" + tempOneCookie.value + "; ")
                }
            })
        } else {
            list.arrayCookie.forEach((tempOneCookie2) => {
                if (tempOneCookie2.name) {
                    appendList(tempOneCookie2.name + "=" + tempOneCookie2.value + "; ")
                }
            })
        }
    }
}


async function onClickSearchButton(event3) {
    event3.preventDefault()

    let currentTab = await chromeGetCurrentTab();

    var currentUrl = currentTab.url;
    var domain = getDomainFromUrl(currentUrl)

    let inputJDDomain = document.querySelector("#input-domaintext")
    let inputCurrentDomain = inputJDDomain.value

    console.log("===== inputJDDomain value: ", inputJDDomain.value)

    if (!inputCurrentDomain) {
        inputJDDomain.value = domain.domain
        inputCurrentDomain = domain.domain
        console.log("===== inputCurrentDomain: ", inputCurrentDomain)
    }

    allCookies = await chromeGetAllCookies(inputCurrentDomain)

    await showCookieList(allCookies)

    modifyText(spanContentPtKey, "pt_key=" + allCookies.objectCookie.pt_key + ";")
    modifyText(spanContentPtPin, "pt_pin=" + allCookies.objectCookie.pt_pin + ";")
    modifyText(spanContentPtKeyAndPin, "pt_key=" + allCookies.objectCookie.pt_key + ";" + "pt_pin=" + allCookies.objectCookie.pt_pin + ";")

    // text2clip(stringCookie)
}


async function onClickInput(event3) {
    await showCookieList(allCookies)
}


function onClickSpan1(event3) {
    copyTextToClipboard(spanContentPtKeyAndPin.innerHTML)
}

function onClickSpan2(event3) {
    copyTextToClipboard(spanContentPtKey.innerHTML)
}

function onClickSpan3(event3) {
    copyTextToClipboard(spanContentPtPin.innerHTML)
}


buttonSearchElement.addEventListener('click', onClickSearchButton, false);
textSearchElement.addEventListener('input', onClickInput, false);

spanContentPtKeyAndPin.addEventListener('click', onClickSpan1, false);
spanContentPtKey.addEventListener('click', onClickSpan2, false);
spanContentPtPin.addEventListener('click', onClickSpan3, false);




// getChromeData()