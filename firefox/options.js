const postRadio1Element = document.querySelector("#postRadio1");
const postRadio2Element = document.querySelector("#postRadio2");
const postRadio3Element = document.querySelector("#postRadio3");

const listRadio1Element = document.querySelector("#listRadio1");
const listRadio2Element = document.querySelector("#listRadio2");
const listRadio3Element = document.querySelector("#listRadio3");

const userBlockRadio1Element = document.querySelector("#userBlockedRadio1");
const userBlockRadio2Element = document.querySelector("#userBlockedRadio2");

const buttonBlockUserRanking = document.querySelector("#btnBlockUserRanking");
const buttonBlockUserList = document.querySelector("#btnBlockUserList");

const boxBlockUserRanking = document.querySelector("#blockUserRanking");
const boxBlockUserList = document.querySelector("#blockUserList");

const buttonUserAddSingle = document.querySelector("#user-add");
const buttonUserAddBatch = document.querySelector("#user-add-batch");
const buttonUserError = document.querySelector("#btnInputError");
const inputUsername = document.querySelector("#username");
const inputRemark = document.querySelector("#remark");

const userListElement = document.querySelector("#user-list");


const isDebug = false;
let apiPrefix = isDebug ? 'http://localhost:8088' : 'https://tgfcer.jscool.net'

let autoIncrement = 10000;
let currentUsername = '';
let currentUserId = '';
let blockPostDisplayType = 1;
let blockListDisplayType = 1;
let userBlockListDisplayType = 2;

let blockUserList = [];
let remarkList = [];


// chrome.storage.sync.clear()
// chrome.storage.local.clear()

function onSuccess(item) {
    console.log(`Firefox local storage save data:  `, item);
}


function onError(error) {
    console.log(`Firefox local storage save error :  `, error)
}

function saveLocalStorage(data) {
    const dataTemp = {
        tgfcerBlockUsers: blockUserList,
        tgfcerAutoIncrement: autoIncrement,
        tgfcerBlockPostDisplayType: blockPostDisplayType,
        tgfcerBlockListDisplayType: blockListDisplayType,
        tgfcerUserBlockListDisplayType: userBlockListDisplayType,
        tgfcerUserBlockListRemarkList: remarkList,
        tgfcerCurrentUsername: currentUsername,
        tgfcerCurrentUserId: currentUserId
    }

    browser.storage.local.set(dataTemp).then(onSuccess, onError);
}


function getLocalStorage() {
    browser.storage.local.get().then(function(result) {
        console.log('Firefox local storage get data: ', result)

        if (result) {

            blockUserList = result.tgfcerBlockUsers || [];
            remarkList = result.tgfcerUserBlockListRemarkList || [];
            autoIncrement = result.tgfcerAutoIncrement || 10000;
            blockPostDisplayType = result.tgfcerBlockPostDisplayType || 1;
            blockListDisplayType = result.tgfcerBlockListDisplayType || 1;
            userBlockListDisplayType = result.tgfcerUserBlockListDisplayType || 2;
            currentUsername = result.tgfcerCurrentUsername || 'unknown';
            currentUserId = result.tgfcerCurrentUserId || '';

            setRadioValue();
            showList();
            delegateSelectTag();
        }
    }, onError);
}


function toggleShow(element) {
    element.style.display = "block";
}

function toggleHidden(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.visibility = "visible";
}

function hideElement(element) {
    element.style.visibility = "hidden";
}

function toggleShowButtonUserList() {
    if (userBlockListDisplayType === 2) {
        showElement(buttonBlockUserRanking)
        showElement(buttonBlockUserList)
    } else {
        hideElement(buttonBlockUserRanking)
        hideElement(buttonBlockUserList)
    }
}


function setRadioValue() {
    if (blockPostDisplayType === 1) {
        postRadio1Element.checked = true;
    } else if (blockPostDisplayType === 2) {
        postRadio2Element.checked = true;
    } else if (blockPostDisplayType === 3) {
        postRadio3Element.checked = true;
    }

    if (blockListDisplayType === 1) {
        listRadio1Element.checked = true;
    } else if (blockListDisplayType === 2) {
        listRadio2Element.checked = true;
    } else if (blockListDisplayType === 3) {
        listRadio3Element.checked = true;
    }

    if (userBlockListDisplayType === 1) {
        userBlockRadio1Element.checked = true;
    } else if (userBlockListDisplayType === 2) {
        userBlockRadio2Element.checked = true;
    }
    toggleShowButtonUserList()
}

function onclickPostRadio(event1) {
    const postRadioCheckElement = document.querySelector('input[name="postRadioOptions"]:checked');
    // console.log(postRadioCheckElement)
    blockPostDisplayType = Number(postRadioCheckElement.value);
    saveLocalStorage();
}

function onclickListRadio(event1) {
    const listRadioCheckElement = document.querySelector('input[name="listRadioOptions"]:checked');
    blockListDisplayType = Number(listRadioCheckElement.value);
    saveLocalStorage();
}

function onclickUserBlockRadio(event1) {
    const userBlockRadioCheckElement = document.querySelector('input[name="userBlockedRadioOptions"]:checked');
    userBlockListDisplayType = Number(userBlockRadioCheckElement.value);
    saveLocalStorage();

    toggleShowButtonUserList()
}

function onclickBlockUserRankingButton(event1) {
    toggleShow(boxBlockUserRanking)
    toggleHidden(boxBlockUserList)
}

function onclickBlockUserListButton(event1) {
    toggleHidden(boxBlockUserRanking)
    toggleShow(boxBlockUserList)
}


postRadio1Element.addEventListener('click', onclickPostRadio, false);
postRadio2Element.addEventListener('click', onclickPostRadio, false);
postRadio3Element.addEventListener('click', onclickPostRadio, false);

listRadio1Element.addEventListener('click', onclickListRadio, false);
listRadio2Element.addEventListener('click', onclickListRadio, false);
listRadio3Element.addEventListener('click', onclickListRadio, false);


userBlockRadio1Element.addEventListener('click', onclickUserBlockRadio, false);
userBlockRadio2Element.addEventListener('click', onclickUserBlockRadio, false);

buttonBlockUserRanking.addEventListener('click', onclickBlockUserRankingButton, false);
buttonBlockUserList.addEventListener('click', onclickBlockUserListButton, false);



function delegateSelectTag() {
    const tempSelectJQELement = $(userListElement);
    tempSelectJQELement.delegate('select', 'change', function() {
        const tempThis = $(this);

        let currentIdTemp = '';
        if (tempThis.attr('id')) {
            currentIdTemp = tempThis.attr('id').slice(7);
        }
        document.querySelector("#inputremark-" + currentIdTemp.toString()).value = tempThis.children('option:selected').val();
    });
}


function showList(userId) {

    let html = ""

    blockUserList.forEach((user) => {

        if (userId && userId === user.id.toString()) {

            let tempOptonsHtml = `<option value="">请选择备注</option>`
            remarkList.forEach((tag) => {

                if (tag === user.remark) {
                    tempOptonsHtml = tempOptonsHtml + `<option value="${tag}" selected>${tag}</option>`
                } else {
                    tempOptonsHtml = tempOptonsHtml + `<option value="${tag}">${tag}</option>`
                }
            })

            html = html + `<li class="list-group-item" id="id-${user.id}"> <input type="text" class="form-control col-sm-3 float-left mr-3" id="input-${user.id}" value="${user.name}"> <select class="form-control float-left col-sm-2" id="select-${user.id}"> ${tempOptonsHtml}</select> <input type="text" class="form-control col-sm-3 float-left ml-1" id="inputremark-${user.id}" value="${user.remark}"> <button class="btn btn-outline-primary ml-2 float-left" id="save-${user.id}">保存修改</button> </li>`
        } else {
            html = html + `<li class="list-group-item" id="id-${user.id}"> ${user.name} | ${user.remark} <button class="btn btn-outline-primary btn-sm ml-4" id="edit-${user.id}">编辑</button> <button class="btn btn-outline-danger btn-sm" id="dele-${user.id}">删除</button> </li>`
        }
    })

    userListElement.innerHTML = html;
}



getLocalStorage();
showList();


function onclickAddButtonSingle(event1) {
    event1.preventDefault();



    inputUsername.classList.remove("is-invalid");
    buttonUserError.innerHTML = '用户为空或已存在!';

    if (!inputUsername.value.trim()) {
        inputUsername.classList.add("is-invalid");
        return;
    }

    if (inputUsername.value.indexOf(',') > -1) {
        return;
    }


    const newUser = {
        id: autoIncrement,
        name: inputUsername.value.trim(),
        currentUsername: currentUsername,
        remark: inputRemark.value.trim() || ''
    }

    const isExist = blockUserList.find((user) => newUser.name === user.name)

    if (isExist) {
        inputUsername.classList.add("is-invalid");
    } else {
        blockUserList.push(newUser);
        showList();

        inputUsername.value = '';
        inputRemark.value = '';
        autoIncrement = autoIncrement + 1;

        saveLocalStorage();



        // 上传屏蔽用户信息
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

        if (userBlockListDisplayType === 2) {
            const postUser = {
                token: getToken(26),
                localId: newUser.id,
                submitUsername: currentUsername,
                blockedUsername: newUser.name,
                remark: newUser.remark,
            };

            $.ajax({
                url: apiPrefix + "/api/tgfcer/user/blocked",
                method: "POST",
                data: JSON.stringify(postUser),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function(data) {
                console.log('jQuery Ajax success!')
            }).fail(() => {
                console.log('jQuery Ajax error!')
            }).always(() => {
                // console.log('jQuery Ajax complete!')
            });

        }
    }
}


function onclickAddButtonBatch(event2) {
    event2.preventDefault();


    inputUsername.classList.remove("is-invalid");
    buttonUserError.innerHTML = '用户为空或已存在!';

    if (!inputUsername.value.trim()) {
        inputUsername.classList.add("is-invalid");
        return;
    }

    if (inputUsername.value.indexOf(',') === -1) {
        return;
    }


    let usernameListTemp = inputUsername.value.trim().split(',');
    console.log(inputUsername, usernameListTemp)

    let usernameListExistTemp = [];
    if (usernameListTemp && usernameListTemp.length > 1) {

        usernameListTemp.forEach((username) => {

            if (username) {
                const newUser = {
                    id: autoIncrement,
                    name: username.trim(),
                    currentUsername: currentUsername,
                    remark: ''
                }

                const isExist = blockUserList.find((user) => newUser.name === user.name)

                if (isExist) {
                    inputUsername.classList.add("is-invalid");
                    usernameListExistTemp.push(username)
                } else {
                    blockUserList.push(newUser);

                    inputUsername.value = '';
                    inputRemark.value = '';
                    autoIncrement = autoIncrement + 1;

                }
            }
        })

        if (usernameListExistTemp.length > 0) {
            buttonUserError.innerHTML = '用户为空或已存在用户:  ' + usernameListExistTemp.join(',') + ' (已导入不存在的用户)';
        }
        showList();
        saveLocalStorage();
    }

}


buttonUserAddSingle.addEventListener('click', onclickAddButtonSingle, false);
buttonUserAddBatch.addEventListener('click', onclickAddButtonBatch, false);




function onclickDelButton(event1) {

    const target = event1.target;
    let currentId = target.id || '';
    let isEditSave = target.id || '';

    if (currentId) {
        currentId = target.id.slice(5);
        isEditSave = target.id.slice(0, 5);
    }

    if (target.nodeName.toLocaleLowerCase() === 'button' && currentId) {

        let isExist = blockUserList.find((user) => currentId === user.id.toString())

        if (isExist) {

            if (target.className.indexOf('btn-outline-danger') > -1) {
                // Delete
                const indexUser = blockUserList.indexOf(isExist);
                blockUserList.splice(indexUser, 1);

                showList();
                saveLocalStorage();

            } else {

                if (isEditSave === "edit-") {
                    // Edit show input
                    showList(currentId);
                } else {
                    // Edit save
                    isExist.name = document.querySelector("#input-" + currentId.toString()).value
                    isExist.remark = document.querySelector("#inputremark-" + currentId.toString()).value


                    if (remarkList.indexOf(isExist.remark) === -1) {
                        remarkList.push(isExist.remark);
                    }

                    showList();
                    saveLocalStorage();
                }
            }
        }

    }
}

userListElement.addEventListener('click', onclickDelButton, false);