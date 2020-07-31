

const userListElement = document.querySelector("#post-list");
const buttonSearchElement = document.querySelector("#btn-search");
const buttonClearTagElement = document.querySelector("#btn-cleartag");
const selectSearchElement = document.querySelector("#searchtag");


const isDebug = false;
let apiPrefix = isDebug ? 'http://localhost:8088' : 'http://tgfcer.jscool.net'
let currentUsername = '';
let currentUserId = '';
let userFavoriteLinkList = [];
let tagList = [];



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


function saveFavoriteTagListToLocalStorage(tags) {
    if (tags && Array.isArray(tags)) {

        chrome.storage.local.set({ favoritePostTagList: tags }, function() {
            console.log('Chrome local storage saved data: ', tags)
        })
    }
}

function getLocalStorage() {
    chrome.storage.local.get(null, function(result) {
        console.log('Chrome local storage get data: ', result)
        if (result && result.currentUsername) {
            currentUsername = result.currentUsername.trim();
        }
        if (result && result.currentUserId) {
            currentUserId = result.currentUserId;
        }
        if (result && result.favoritePostTagList) {
            tagList = result.favoritePostTagList;
        }

        showList();
        showSelectOptions()
    })
}


function getChromeData() {
    chrome.storage.sync.get(null, function(result) {
        console.log(`Chrome.storage get currently is `, result);

        if (result) {
            // callback (null, result[key])
            currentUsername = result.tgfcerCurrentUsername || '';
            currentUserId = result.tgfcerCurrentUserId || '';
            tagList = result.tgfcerFavoritePostTagList || [];
        }

        if (!currentUsername || !currentUserId || tagList.length === 0) {
            // 获取当前用户名称
            getLocalStorage()
        } else {
            showList();
            showSelectOptions()
        }

    });
}







function showSelectOptions () {
    $("#searchtag").empty();

    const opt = document.createElement('option');
    opt.value = '全部';
    opt.innerHTML = '全部';
    selectSearchElement.appendChild(opt);

    tagList.forEach( (tag) => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.innerHTML = tag;
        selectSearchElement.appendChild(opt);
    })
}

function showList(uuid) {

    const tempQuery = {
        token: getToken(26),
        uid: currentUserId
    }

    const searchText = document.querySelector("#input-searchtext").value
    if (searchText) {
        tempQuery.title = encodeURIComponent(searchText.trim())
    }

    const searchTag = $("#searchtag :selected").text();
    if (searchTag && searchTag !== '全部') {
        tempQuery.tag = encodeURIComponent(searchTag.trim())
    }

    $.ajax({
        url: apiPrefix + "/api/tgfcer/user/favorite",
        method: "GET",
        data: tempQuery,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done( (data) => {
        if (Array.isArray(data.data)) {
            userFavoriteLinkList = data.data;

            let tempHtml = '';

            userFavoriteLinkList.forEach((post) => {

                if (uuid && uuid === post.uuid) {
                    tempHtml = tempHtml + `<li class="list-group-item" id="id-${post.uuid}"> <span class="float-left mr-2">${post.threadTitle}</span> <input type="text" class="form-control col-sm-4 float-left" id="inputtag-${post.uuid}" value="${post.threadTag}" placeholder="请填写分类"> <input type="text" class="form-control col-sm-4 float-left ml-1" id="inputremark-${post.uuid}" value="${post.remark}" placeholder="请填写备注"> <button class="btn btn-outline-primary btn-sm ml-2 float-left" id="save-${post.uuid}">保存修改</button> </li>`
                } else {
                    tempHtml = tempHtml + `<li class="list-group-item" id="id-${post.uuid}"> ${post.threadTitle} | 分类: ${post.threadTag || '暂无'}  | 备注: ${post.remark || '暂无'} <button class="btn btn-outline-primary btn-sm ml-4" id="edit-${post.uuid}">编辑</button> <button class="btn btn-outline-danger btn-sm" id="dele-${post.uuid}">删除</button> </li>`
                }
            })

            userListElement.innerHTML = tempHtml;
        }

        // console.log('jQuery Ajax success!')
    })
    .fail( () => {
        console.log('jQuery Ajax error!')
    })
    .always( () => {
        // console.log('jQuery Ajax complete!')
    });


}


getChromeData()








function onclickEditButton(event1) {

    const target = event1.target;
    let currentId = target.id || '';
    let isEditSave = target.id || '';

    if (currentId) {
        currentId = target.id.slice(5);
        isEditSave = target.id.slice(0, 5);
    }

    if (target.nodeName.toLocaleLowerCase() === 'button' && currentId) {

        let isExist = userFavoriteLinkList.find((post) => currentId === post.uuid)

        if (isExist) {

            if (target.className.indexOf('btn-outline-danger') > -1) {
                // Delete
                const indexUser = userFavoriteLinkList.indexOf(isExist);
                userFavoriteLinkList.splice(indexUser, 1);

                $.ajax({
                    url: apiPrefix + "/api/tgfcer/user/favorite/" + isExist.uuid,
                    method: "DELETE",
                    data: JSON.stringify({
                        token: getToken(26),
                        uuid: isExist.uuid,
                        submitUserId: currentUserId,
                        threadId: isExist.threadId,
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done( (data) => {
                    showList();
                    // console.log('jQuery Ajax success!')
                }).fail( () => {
                    console.log('jQuery Ajax error!')
                })
                .always( () => {
                    // console.log('jQuery Ajax complete!')
                });

            } else {

                if (isEditSave === "edit-") {
                    // Edit show input
                    showList(currentId);
                } else {
                    // Edit save
                    isExist.threadTag = document.querySelector("#inputtag-" + currentId.toString()).value || '';
                    isExist.remark = document.querySelector("#inputremark-" + currentId.toString()).value || '';

                    isExist.threadTag = isExist.threadTag.trim();

                    if (!isExist.threadTag) {
                        alert('请填写分类')
                        return;
                    }

                    if (tagList.indexOf(isExist.threadTag) === -1) {
                        tagList.push(isExist.threadTag);
                        showSelectOptions();
                        saveFavoriteTagListToLocalStorage(tagList);
                    }

                    $.ajax({
                        url: apiPrefix + "/api/tgfcer/user/favorite/" + isExist.uuid,
                        method: "PUT",
                        data: JSON.stringify({
                            token: getToken(26),
                            uuid: isExist.uuid,
                            submitUsername: isExist.submitUsername,
                            submitUserId: currentUserId,
                            threadId: isExist.threadId,
                            threadTag: isExist.threadTag,
                            remark: isExist.remark,
                            website: isExist.website,
                        }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done( (data) => {
                        showList();
                        // console.log('jQuery Ajax success!')
                    }).fail( () => {
                        console.log('jQuery Ajax error!')
                    }).always( () => {
                        // console.log('jQuery Ajax complete!')
                    });
                }
            }
        }
    }
}


userListElement.addEventListener('click', onclickEditButton, false);


function onClickSearchButton (event3) {
    event3.preventDefault()
    showList()
}
buttonSearchElement.addEventListener('click', onClickSearchButton, false);


function onClickClearTagButton (event4) {
    event4.preventDefault()
    tagList = []
    showSelectOptions();
    saveFavoriteTagListToLocalStorage(tagList);
}
buttonClearTagElement.addEventListener('click', onClickClearTagButton, false);