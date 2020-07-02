const postRadio1Element = document.querySelector("#postRadio1");
const postRadio2Element = document.querySelector("#postRadio2");
const postRadio3Element = document.querySelector("#postRadio3");

const listRadio1Element = document.querySelector("#listRadio1");
const listRadio2Element = document.querySelector("#listRadio2");
const listRadio3Element = document.querySelector("#listRadio3");


const buttonUserAdd = document.querySelector("#user-add");
const inputUsername = document.querySelector("#username");

const userListElement = document.querySelector("#user-list");


let autoIncrement = 10000;
let blockPostDisplayType = 1;
let blockListDisplayType = 1;

let blockUserList = [];


// chrome.storage.sync.clear()

function saveChromeData(data) {
    const dataTemp = {
        tgfcerBlockUsers: blockUserList,
        tgfcerAutoIncrement: autoIncrement,
        tgfcerBlockPostDisplayType: blockPostDisplayType,
        tgfcerBlockListDisplayType: blockListDisplayType
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
            setRadioValue();
            showList();
        }
    });
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

postRadio1Element.addEventListener('click', onclickPostRadio, false);
postRadio2Element.addEventListener('click', onclickPostRadio, false);
postRadio3Element.addEventListener('click', onclickPostRadio, false);

listRadio1Element.addEventListener('click', onclickListRadio, false);
listRadio2Element.addEventListener('click', onclickListRadio, false);
listRadio3Element.addEventListener('click', onclickListRadio, false);


function showList(userId) {

    let html = ""

    blockUserList.forEach((user) => {

        if (userId && userId === user.id.toString()) {

            html = html + `<li class="list-group-item" id="id-${user.id}">  <input type="text" class="form-control col-sm-4 float-left" id="input-${user.id}" value="${user.name}"> <button class="btn btn-outline-primary btn-sm ml-4 float-left" id="save-${user.id}">保存修改</button> </li>`
        } else {
            html = html + `<li class="list-group-item" id="id-${user.id}">  ${user.name} <button class="btn btn-outline-primary btn-sm ml-4" id="edit-${user.id}">编辑</button> <button class="btn btn-outline-danger btn-sm" id="dele-${user.id}">删除</button> </li>`
        }
    })

    userListElement.innerHTML = html;
}



getChromeData();
showList();


function onclickAddButtonOption(event1) {
    event1.preventDefault();

    const newUser = {
        id: autoIncrement,
        name: inputUsername.value.trim()
    }

    inputUsername.classList.remove("is-invalid");

    if (!newUser.name) {
        inputUsername.classList.add("is-invalid");
        return;
    }

    const isExist = blockUserList.find((user) => newUser.name === user.name)

    if (isExist) {
        inputUsername.classList.add("is-invalid");
    } else {
        blockUserList.push(newUser);
        showList();

        inputUsername.value = '';
        autoIncrement = autoIncrement + 1;

        saveChromeData();
    }
}

buttonUserAdd.addEventListener('click', onclickAddButtonOption, false);




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
                    showList();
                    saveChromeData();
                }

            }
        }

    }
}

userListElement.addEventListener('click', onclickDelButton, false);