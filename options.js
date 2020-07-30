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


let autoIncrement = 10000;
let currentUsername = '';
let currentUserId = '';
let blockPostDisplayType = 1;
let blockListDisplayType = 1;
let userBlockListDisplayType = 2;

let blockUserList = [];


// chrome.storage.sync.clear()
// chrome.storage.local.clear()


function saveChromeData(data) {
    const dataTemp = {
        tgfcerBlockUsers: blockUserList,
        tgfcerAutoIncrement: autoIncrement,
        tgfcerBlockPostDisplayType: blockPostDisplayType,
        tgfcerBlockListDisplayType: blockListDisplayType,
        tgfcerUserBlockListDisplayType: userBlockListDisplayType,
        tgfcerCurrentUsername: currentUsername,
        tgfcerCurrentUserId: currentUserId
    }

    chrome.storage.sync.set(dataTemp, function() {
        console.log(`Chrome.storage is set to `, dataTemp);
    });
}

function getChromeData() {
    chrome.storage.sync.get(null, function(result) {
        console.log(`Chrome.storage get currently is `, result);

        if (result) {
            // callback (null, result[key])

            blockUserList = result.tgfcerBlockUsers || [];
            autoIncrement = result.tgfcerAutoIncrement || 10000;
            blockPostDisplayType = result.tgfcerBlockPostDisplayType || 1;
            blockListDisplayType = result.tgfcerBlockListDisplayType || 1;
            userBlockListDisplayType = result.tgfcerUserBlockListDisplayType || 2;
            currentUsername = result.tgfcerCurrentUsername || 'unknown';
            currentUserId = result.tgfcercurrentUserId || '';
            setRadioValue();
            showList();
        }

        if (autoIncrement === 10000 || currentUsername === 'unknown' || !currentUserId) {
            // 获取当前用户名称
            getLocalStorage()
        }
    });
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
    })
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
    saveChromeData();
}

function onclickListRadio(event1) {
    const listRadioCheckElement = document.querySelector('input[name="listRadioOptions"]:checked');
    blockListDisplayType = Number(listRadioCheckElement.value);
    saveChromeData();
}

function onclickUserBlockRadio(event1) {
    const userBlockRadioCheckElement = document.querySelector('input[name="userBlockedRadioOptions"]:checked');
    userBlockListDisplayType = Number(userBlockRadioCheckElement.value);
    saveChromeData();

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


function showList(userId) {

    let html = ""

    blockUserList.forEach((user) => {

        if (userId && userId === user.id.toString()) {

            html = html + `<li class="list-group-item" id="id-${user.id}">  <input type="text" class="form-control col-sm-4 float-left" id="input-${user.id}" value="${user.name}">  <input type="text" class="form-control col-sm-4 float-left ml-1" id="inputremark-${user.id}" value="${user.remark}"> <button class="btn btn-outline-primary btn-sm ml-4 float-left" id="save-${user.id}">保存修改</button> </li>`
        } else {
            html = html + `<li class="list-group-item" id="id-${user.id}">  ${user.name} | ${user.remark} <button class="btn btn-outline-primary btn-sm ml-4" id="edit-${user.id}">编辑</button> <button class="btn btn-outline-danger btn-sm" id="dele-${user.id}">删除</button> </li>`
        }
    })

    userListElement.innerHTML = html;
}



getChromeData();
showList();


function onclickAddButtonSingle(event1) {
    event1.preventDefault();

    if (!currentUsername || currentUsername === 'unknown') {
        getLocalStorage()
    }

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

        saveChromeData();



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
                // url: "http://localhost:8088/api/tgfcer/user/blocked",
                url: "http://tgfcer.jscool.net/api/tgfcer/user/blocked",
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

    if (!currentUsername || currentUsername === 'unknown') {
        getLocalStorage()
    }

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
        saveChromeData();
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
                saveChromeData();

            } else {

                if (isEditSave === "edit-") {
                    // Edit show input
                    showList(currentId);
                } else {
                    // Edit save
                    isExist.name = document.querySelector("#input-" + currentId.toString()).value
                    isExist.remark = document.querySelector("#inputremark-" + currentId.toString()).value
                    showList();
                    saveChromeData();
                }

            }
        }

    }
}

userListElement.addEventListener('click', onclickDelButton, false);