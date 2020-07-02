
const radio1Element = document.querySelector("#inlineRadio1");
const radio2Element = document.querySelector("#inlineRadio2");
const formElement = document.querySelector("#form");
const buttonUserAdd = document.querySelector("#user-add");
const inputUsername = document.querySelector("#username");

const userListElement = document.querySelector("#user-list");
let autoIncrement = 10000;
let blockDisplayType = 1;

let blockUserList = [];

// chrome.storage.sync.clear()

function saveChromeData(data) {
    const dataTemp = {
        tgfcerBlockUsers : blockUserList,
        tgfcerAutoIncrement: autoIncrement,
        tgfcerBlockDisplayType: blockDisplayType
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
            blockDisplayType = result.tgfcerBlockDisplayType || 1;
            setRadioValue();
            showList();
        } else {
        }
    });
}


function setRadioValue() {
    if (blockDisplayType === 1) {
        radio1Element.checked = true;
    } else {
        radio2Element.checked = true;
    }
}
function onclickRadio (event1) {
    blockDisplayType = Number(document.querySelector('input[name="inlineRadioOptions"]:checked').value);
    saveChromeData();
}

radio1Element.addEventListener('click', onclickRadio, false);
radio2Element.addEventListener('click', onclickRadio, false);


function showList(userId) {

    let html = ""

    blockUserList.forEach( (user) => {

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

    const isExist = blockUserList.find( (user) => newUser.name === user.name)

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

    if (target.nodeName.toLocaleLowerCase() === 'button' && currentId)  {

        let isExist = blockUserList.find( (user) => currentId === user.id.toString())

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

