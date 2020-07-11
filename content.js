

(function(){


// console.log("Chrome Extension content script running!")


let blockUserList = [];
let blockUserListArray = [];
let blockPostType = 1;
let blockListType = 1;
let userBlockListType = 2;
let currentUsername = '';
let currentUrl = '';
let isWap = false;
let pageType = 0;


function getChromeData() {
    chrome.storage.sync.get(null, function(result) {
        console.log(`Chrome.storage get currently is `, result);

        if (result) {
            // callback (null, result[key])
            blockUserList = result.tgfcerBlockUsers || [];
            blockUserListArray = blockUserList.map( user => user.name );
            blockPostType = result.tgfcerBlockPostDisplayType || 1;
            blockListType = result.tgfcerBlockListDisplayType || 1;
            userBlockListType = result.tgfcerUserBlockListDisplayType || 2;
            findUserElement()
            getCurrentUsername()
        }
    });
}

function getCurrentUrl () {
    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     currentUrl = tabs[0].url;
    //     // use `url` here inside the callback because it's asynchronous!
    //
    //     if (currentUrl.indexOf('wap.tgfcer.com')) {
    //         isWap = true;
    //         console.log(isWap, currentUrl);
    //     }
    // });

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




function findUserElement () {

    if (isWap) {

        // 帖子页面处理
        if (blockPostType !== 1 && pageType === 2) {

            let postsWap = document.querySelectorAll(".infobar");
            postsWap.forEach( (post) => {

                const userLink = post.querySelector(".user_name .user_name" );
                // const userPost = post.querySelector(".message.list_item_wrapper" )
                const userPost = post.nextElementSibling;

                // console.log(userLink, userLink.innerHTML)
                // console.log(userPost, userPost.innerHTML)

                if (blockUserListArray.indexOf( userLink.innerHTML.trim() ) > -1 ) {
                    if (blockPostType === 2) {
                        userPost.style.color = "#f0f0f0";
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

            listsWap.forEach( (list) => {
                const userLink = list.querySelector(".author" )
                const userTitle = list.querySelector(".title a" )

                const usernameTemp = userLink.innerHTML.trim().slice(1, -1)

                let username = usernameTemp.split('/') || [];

                // console.log(usernameTemp, username);
                // console.log(userTitle);

                if (username && username.length > 0) {
                    if (blockUserListArray.indexOf( username[0].trim() ) > -1 ) {
                        if (blockListType === 2) {
                            userTitle.style.color = "#ededed";
                            userLink.style.color = "#ededed";
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
            posts.forEach( (post) => {

                const h1Tile = post.querySelector("h1" )
                const h1Post = post.querySelector("table" )
                const userLink = post.querySelector("cite a" )
                const userPost = post.querySelector(".postmessage.defaultpost .t_msgfont" )
                const userPostTd = post.querySelector(".postmessage" )
                // console.log(userLink, userLink.innerHTML)
                // console.log(userPost, userPost.innerHTML)

                if (blockUserListArray.indexOf( userLink.innerHTML.trim() ) > -1 ) {
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
                lists.forEach( (list) => {
                    const userLink = list.querySelector(".author cite a" )
                    const userTitle = list.querySelector("th span a" )

                    // console.log(userLink, userLink.innerHTML);

                    if (blockUserListArray.indexOf( userLink.innerHTML.trim() ) > -1 ) {
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



function getCurrentUsername () {

    if (isWap) {
        const usernameBox = document.querySelector(".userInfo" )

        if (usernameBox) {
            const usernameTd = usernameBox.querySelectorAll("td" )
            const username = usernameTd[1].querySelector("b" )

            if (username && username.innerHTML.length > 0) {
                currentUsername = username.innerHTML.trim()
            }
        }

    } else {
        const usernameLink = document.querySelector("#my b" )

        if (usernameLink && usernameLink.innerHTML.length > 0) {
            currentUsername = usernameLink.innerHTML.trim()
        }
    }

    if (currentUsername) {
        chrome.storage.local.set ( {currentUsername : currentUsername}, function (){
            console.log('Chrome local storage saved data: ', currentUsername)
        })
    }
}



getCurrentUrl();
getChromeData()



})();