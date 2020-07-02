

(function(){


// console.log("Chrome Extension content script running!")


let blockUserList = [];
let blockUserListArray = [];
let blockType = 1;
let currentUrl = '';
let isWap = false;


function getChromeData() {
    chrome.storage.sync.get(null, function(result) {
        console.log(`Chrome.storage get currently is `, result);

        if (result) {
            // callback (null, result[key])
            blockUserList = result.tgfcerBlockUsers || [];
            blockUserListArray = blockUserList.map( user => user.name );
            blockType = result.tgfcerBlockDisplayType;
            findUserElement()

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
}




function findUserElement () {

    if (isWap) {
        let postsWapBox = document.querySelector(".scroller");
        let postsWap = document.querySelectorAll(".infobar");

        postsWap.forEach( (post) => {

            const userLink = post.querySelector(".user_name .user_name" );
            // const userPost = post.querySelector(".message.list_item_wrapper" )
            const userPost = post.nextElementSibling;

            // console.log(userLink, userLink.innerHTML)
            // console.log(userPost, userPost.innerHTML)

            if (blockUserListArray.indexOf( userLink.innerHTML.trim() ) > -1 ) {
                if (blockType === 1) {
                    userPost.style.color = "#f0f0f0";
                } else {
                    post.remove();
                    userPost.remove();
                }
            }
        })
    } else {
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
                if (blockType === 1) {
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

}

getCurrentUrl();
getChromeData()



})();