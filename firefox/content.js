(function() {


    // console.log("Chrome Extension content script running!")

    const isDebug = false;
    let apiPrefix = isDebug ? 'http://localhost:8088' : 'https://tgfcer.jscool.net'


    let userFavoriteLinkIdList = [];
    let blockUserList = [];
    let blockUserListArray = [];
    let blockPostType = 1;
    let blockListType = 1;
    let userBlockListType = 2;
    let currentUsername = '';
    let currentUserId = '';
    let currentUrl = '';
    let isWap = false;
    let pageType = 0;



    function onSuccess(item) {
        console.log(`Firefox local storage save data:  `, item);
    }

    function onError(error) {
        console.log(`Firefox local storage save error :  `, error)
    }

    function getCurrentUsernameAndUserId() {

        if (isWap) {
            const usernameBox = document.querySelector(".userInfo")

            if (usernameBox) {
                const usernameTd = usernameBox.querySelectorAll("td")
                const username = usernameTd[1].querySelector("b")

                if (username && username.innerHTML.length > 0) {
                    currentUsername = username.innerHTML.trim()
                }
            }

            const userIdPTag = document.querySelector("#scroller p")
            const userIdAtagList = userIdPTag.querySelectorAll("a")
            const regexUserIdWap = /&authorid=([\d]+)/

            if (userIdAtagList) {
                for (let i = 0; i < userIdAtagList.length; ++i) {
                    const tagUserId = userIdAtagList[i];
                    const resultUserIdRegex = regexUserIdWap.exec(tagUserId.href)
                        // console.log(resultUserIdRegex, tagUserId)
                    if (tagUserId.innerHTML === '@我' && resultUserIdRegex) {
                        if (resultUserIdRegex[1]) {
                            currentUserId = resultUserIdRegex[1]
                        }
                    }
                }
            }
        } else {
            const usernameLinkB = document.querySelector("#my b")
            const usernameLink = document.querySelector("#my")

            if (usernameLinkB && usernameLinkB.innerHTML.length > 0) {
                currentUsername = usernameLinkB.innerHTML.trim()
            }

            if (usernameLink) {
                const regexUserId = /action=viewpro&uid=([\d]+)/;
                const regexResultUserId = regexUserId.exec(usernameLink.href);

                if (regexResultUserId) {
                    currentUserId = regexResultUserId[1] || ''
                }
            }
        }

        return { currentUsername: currentUsername, currentUserId: currentUserId }
    }

    function getCurrentUsername() {
        var tempUserInfo = getCurrentUsernameAndUserId()
        if (tempUserInfo && tempUserInfo.currentUsername) {
            currentUsername = tempUserInfo.currentUsername;

            browser.storage.local.set({ tgfcerCurrentUsername: currentUsername }).then(onSuccess, onError);
        }
    }

    function getCurrentUserId() {
        var tempUserInfo = getCurrentUsernameAndUserId()
        if (tempUserInfo && tempUserInfo.currentUserId) {
            currentUserId = tempUserInfo.currentUserId;

            browser.storage.local.set({ tgfcerCurrentUserId: currentUserId }).then(onSuccess, onError);
        }
    }


    function getLocalStorage() {
        browser.storage.local.get().then(function(result) {
            console.log('Firefox local storage get data: ', result)

            if (result) {

                blockUserList = result.tgfcerBlockUsers || [];
                blockUserListArray = blockUserList.map(user => user.name);
                blockPostType = result.tgfcerBlockPostDisplayType || 1;
                blockListType = result.tgfcerBlockListDisplayType || 1;
                userBlockListType = result.tgfcerUserBlockListDisplayType || 2;
                userFavoriteLinkIdList = result.tgfcerUserFavoriteLinkIdList || [];
                currentUsername = result.tgfcerCurrentUsername || '';
                currentUserId = result.tgfcerCurrentUserId || '';

                getCurrentUsername()
                getCurrentUserId()

                findUserElement()

                addWAPLinkOfWebLink()

                showColorWithRating()

            }
        }, onError);
    }



    function getCurrentUrl() {
        currentUrl = window.location.href;
        // use `url` here inside the callback because it's asynchronous!

        if (currentUrl.indexOf('wap.tgfcer.com') > -1) {
            isWap = true;
        }

        if (currentUrl.indexOf('forum') > -1) {
            pageType = 1; // list page
        }

        if (currentUrl.indexOf('thread') > -1) {
            pageType = 2; // thread page
        }

        // console.log(isWap, currentUrl);
    }


    function findUserElement() {

        if (isWap) {

            // 帖子页面处理
            if (blockPostType !== 1 && pageType === 2) {

                let postsWap = document.querySelectorAll(".infobar");
                postsWap.forEach((post) => {

                    let userLink = '';
                    let userPost = post.nextElementSibling;

                    // 如果界面 显示带图的头像 那么 HTML 结构是不同
                    const tempDiv = post.querySelector('div')
                    if (tempDiv) {
                        userLink = post.querySelector(".user_name .user_name");
                    } else {
                        userLink = post.querySelector(":scope >a");
                    }


                    // console.log(userLink, userLink.innerHTML)
                    // console.log(userPost, userPost.innerHTML)

                    if (userLink && blockUserListArray.indexOf(userLink.innerHTML.trim()) > -1) {
                        if (blockPostType === 2) {
                            const tempStyle = window.getComputedStyle(userPost)
                            userPost.style.color = tempStyle.backgroundColor;
                        } else {
                            post.remove();
                            userPost.remove();
                        }
                    }
                })
            }


            // 列表页面处理
            if (blockListType !== 1 && pageType === 1) {
                let listsWap = document.querySelectorAll(".dTitle");

                listsWap.forEach((list) => {
                    const userLink = list.querySelector(".author")
                    const userTitle = list.querySelector(".title a")

                    const usernameTemp = userLink.innerHTML.trim().slice(1, -1)

                    let username = usernameTemp.split('/') || [];

                    // console.log(usernameTemp, username);
                    // console.log(userTitle);

                    if (username && username.length > 0) {
                        if (blockUserListArray.indexOf(username[0].trim()) > -1) {
                            if (blockListType === 2) {
                                const tempStyle = window.getComputedStyle(userTitle)

                                userTitle.style.color = tempStyle.backgroundColor;
                                userLink.style.color = tempStyle.backgroundColor;
                            } else {
                                list.remove()
                            }
                        }
                    }
                })
            }

        } else {

            // 帖子页面处理
            if (blockPostType !== 1 && pageType === 2) {
                let posts = document.querySelectorAll(".mainbox.viewthread");
                posts.forEach((post) => {
                    const h1Tile = post.querySelector("h1")
                    const h1Post = post.querySelector("table")
                    const userLink = post.querySelector("cite a")
                    const userPost = post.querySelector(".postmessage.defaultpost .t_msgfont")
                    const userPostTd = post.querySelector(".postmessage")


                    if (blockUserListArray.indexOf(userLink.innerHTML.trim()) > -1) {
                        if (blockPostType === 2) {
                            userPostTd.style.color = "#f0f0f0";
                        } else {
                            if (h1Tile) {
                                h1Post.remove();
                            } else {
                                post.remove()
                            }
                        }
                    }
                })
            }

            // 列表页面处理
            if (blockListType !== 1 && pageType === 1) {

                let listForm = document.querySelector("form[name='moderate']");
                if (listForm) {
                    let lists = listForm.querySelectorAll("tbody");
                    lists.forEach((list) => {
                        const userLink = list.querySelector(".author cite a")
                        const userTitle = list.querySelector("th span a")

                        if (blockUserListArray.indexOf(userLink.innerHTML.trim()) > -1) {
                            if (blockListType === 2) {
                                userTitle.style.color = "#ededed";
                            } else {
                                list.remove()
                            }
                        }
                    })
                }
            }

        }
    }









    function showColorWithRating() {
        // 为 Wap 版提供“加量有激骚的回帖”功能，正激骚为红色，负激骚为绿色；（见图）
        if (isWap && pageType === 2) {
            var rateRegex = /^骚\((-?\d+)\)/g;
            var tagRateScoreList = document.getElementsByTagName('a')
            for (let i = 0; i < tagRateScoreList.length; ++i) {
                const tagScore = tagRateScoreList[i];

                const resultScoreRegex = rateRegex.exec(tagScore.innerHTML);
                if (resultScoreRegex && resultScoreRegex[1] !== '0') {

                    if (resultScoreRegex[1].indexOf('-') > -1) {
                        tagScore.style.color = '#00bb00'
                    } else {
                        tagScore.style.color = '#ff0000'
                    }
                }
            }
        }
    }



    function addWAPLinkOfWebLink() {
        // 给 WAP 帖子页面上的 所有 WEB Link 加上  Wap打开 的链接
        // 给 WEB 帖子页面 帖子标题 增加 Wap打开 帖子链接

        // https://club.tgfcer.com/viewthread.php?tid=8318646&extra=&page=3
        var regexThread = /https:\/\/(?:club|s)\.tgfcer\.com\/thread-([\d]+)-.+html/ig;
        var regexThread2 = /https:\/\/(?:club|s)\.tgfcer\.com\/viewthread\.php\?tid=([\d]+)/ig;

        var wapLinkTpl = 'https://wap.tgfcer.com/index.php?action=thread&tid=TidDummy&sid=&vt=1&tp=100&pp=100&sc=0&vf=0&sm=0&iam=&css=&verify=&fontsize=0';

        if (pageType === 2) {
            if (isWap) {

                var tags = document.getElementsByTagName('a')
                for (let i = 0; i < tags.length; ++i) {
                    const tag = tags[i];
                    var href = tag.href || '';
                    const resultLinkRegex = regexThread.exec(href)
                    if (resultLinkRegex) {
                        var wapNewLink1 = wapLinkTpl.replace('TidDummy', resultLinkRegex[1]);

                        var newSpan1 = document.createElement('span');
                        newSpan1.innerHTML = '&nbsp;&nbsp;<a href="' + wapNewLink1 + '" title="">(wap打开)</a>&nbsp;';
                        tag.parentNode.insertBefore(newSpan1, tag.nextSibling);
                    }
                    const resultLinkRegex2 = regexThread2.exec(href)
                    if (resultLinkRegex2) {
                        var wapNewLink2 = wapLinkTpl.replace('TidDummy', resultLinkRegex2[1]);

                        var newSpan2 = document.createElement('span');
                        newSpan2.innerHTML = '&nbsp;&nbsp;<a href="' + wapNewLink2 + '" title="">(wap打开)</a>&nbsp;';
                        tag.parentNode.insertBefore(newSpan2, tag.nextSibling);
                    }
                }
            } else {
                const titleEl = document.querySelector('h1')
                const resultLinkWebRegex1 = regexThread.exec(currentUrl);
                if (resultLinkWebRegex1) {
                    var wapNewLinkWeb1 = wapLinkTpl.replace('TidDummy', resultLinkWebRegex1[1]);
                    var newSpanWeb1 = document.createElement('span');
                    newSpanWeb1.innerHTML = '&nbsp;&nbsp;<a href="' + wapNewLinkWeb1 + '" title="">(wap打开)</a>&nbsp;';
                    titleEl.append(newSpanWeb1);
                }

                const resultLinkWebRegex2 = regexThread2.exec(currentUrl);
                if (resultLinkWebRegex2) {
                    var wapNewLinkWeb2 = wapLinkTpl.replace('TidDummy', resultLinkWebRegex2[1]);
                    var newSpanWeb2 = document.createElement('span');
                    newSpanWeb2.innerHTML = '&nbsp;&nbsp;<a href="' + wapNewLinkWeb2 + '" title="">(wap打开)</a>&nbsp;';
                    titleEl.append(newSpanWeb2);
                }

            }
        }
    }











    // 收藏帖子
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




    getCurrentUrl();
    getLocalStorage();





})();