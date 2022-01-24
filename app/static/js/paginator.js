var dataButton = document.getElementById("data-button");
var deletionButton = document.getElementById("deletion-button");

var startDate = document.getElementById("date-start")
var startTime = document.getElementById("time-start");
var endDate = document.getElementById("date-end");
var endTime = document.getElementById("time-end");

var paginatorSwitcher = document.getElementById("paginator-switcher");
var paginatorList = document.getElementById("paginator-list");



var dataList = 0;
var dataLen = 0;
var switchersCount = 0;
var itemsCount = 5;
var switchers = [];
var selectedSwitcher = 0;
var prevPrevSelectedSwatcher = '';
var prevSelectedSwitcher = '';

var usingAxios = false;
var usingAxiosDeletion = false;

var checkBoxesToSelectedPage = [];
var needRemoveItems = [];
var needRemoveItemsIndexInArray = [];




dataButton.addEventListener("click", function () {
    if (usingAxios === true) {
        return
    }
    usingAxios = true;
    timeLineS = startDate.value + ' ' + startTime.value;
    timeLineE = endDate.value + ' ' + endTime.value;

    var chart = document.getElementsByClassName('canvasjs-chart-container');
    if (chart.length == 1) {
        console.log(paginatorList.parentElement.parentElement);
        paginatorList.parentNode.parentNode.classList.add('paginator-with-chart');
    }

    var promise = axios.get('http://localhost/get_data?time_line_start=' + timeLineS + '&time_line_end=' + timeLineE);
    removeAllChildNodes(paginatorList);
    removeAllChildNodes(paginatorSwitcher);
    promise.then((data) => {
        switchersCount = 0;
        dataList = data.data.data;
        dataLen = dataList.length;
        switchersCount = Math.ceil(dataLen / itemsCount) - 1;
        paginatorListInit();
        generateSwitchers(paginatorSwitcher, switchersCount, switchers);
        addSwitchersListeners(switchers);
        usingAxios = false;
    });
})

function generateSwitchers(paginatorSwitcher, switchersCount, switchers) {
    switchers.length = 0;
    for (var i = 0; i <= switchersCount; i++) {
        let span = createDefaulfSpan(i);
        paginatorSwitcher.appendChild(span);
        switchers.push(span);
    }

    if (switchersCount > 10) {
        for (var i = 8; i < switchersCount; i++) {
            switchers[i].classList.add('switch__item_disabled');
        }
        let spanDelimer = createDelimer()

        switchers[switchersCount].insertAdjacentElement('beforebegin', spanDelimer);
    }

    switchers[0].classList.add('switch__item_selected');
    selectedSwitcher = 0;
}

function addSwitchersListeners(switchers) {
    for (let switcher of switchers) {
        switcher.addEventListener('click', () => switchPage(switcher));
    }
}

function switchPage(switcher) {
    if (selectedSwitcher === prevSelectedSwitcher) {
        prevSelectedSwitcher = prevPrevSelectedSwatcher;
        return;
    }

    switchers[selectedSwitcher].classList.remove('switch__item_selected');
    removeAllChildNodes(paginatorList);
    switcher.classList.add('switch__item_selected');

    prevPrevSelectedSwatcher = prevSelectedSwitcher;
    prevSelectedSwitcher = selectedSwitcher;
    selectedSwitcher = getSwitcherId(switcher);

    paginatorListInit();

    if (switchersCount <= 10) {
        return;
    }

    let leftDelimer = switchers[0].nextSibling.id === 'delimer' ? true : false;
    let rightDelimer = switchers[switchersCount].previousSibling.id === 'delimer' ? true : false;

    if (selectedSwitcher > prevSelectedSwitcher && selectedSwitcher === switchersCount) {
        renderSelectLast();
        return
    }

    if (selectedSwitcher < prevSelectedSwitcher && selectedSwitcher === 0) {
        renderSelectFirst();
        return
    }

    if (5 <= selectedSwitcher && !leftDelimer && rightDelimer) {
        renderLeftDelimer();
        return;
    }

    if (3 <= selectedSwitcher && leftDelimer && rightDelimer && selectedSwitcher > prevSelectedSwitcher) {
        renderBetweenTwoDelimersRightMove(selectedSwitcher, prevSelectedSwitcher);
        return;
    }


    if (selectedSwitcher <= switchersCount - 3 && leftDelimer && rightDelimer && selectedSwitcher < prevSelectedSwitcher) {
        renderBetweenTwoDelimersLeftMove(selectedSwitcher, prevSelectedSwitcher);
        return;
    }

    if (selectedSwitcher <= switchersCount - 5 && leftDelimer && !rightDelimer) {
        renderRightDelimer();
        return;
    }

}

function renderLeftDelimer() {
    for (let i = 1; i < 3; i++) {
        switchers[i].classList.add('switch__item_disabled');
    }
    let countDisableEnable = selectedSwitcher - 5;
    for (let i = 1; i <= countDisableEnable; i++) {
        switchers[2 + i].classList.add('switch__item_disabled');
        switchers[7 + i].classList.remove('switch__item_disabled');
    }
    let leftDilemer = createDelimer()
    switchers[0].insertAdjacentElement('afterend', leftDilemer);
    return;
}

function renderRightDelimer() {
    for (let i = 1; i < 3; i++) {
        switchers[switchersCount - i].classList.add('switch__item_disabled');
    }
    let countDisableEnable = switchersCount - 5 - selectedSwitcher;
    let leftElement = selectedSwitcher - 2 + countDisableEnable;
    for (let i = 1; i <= countDisableEnable; i++) {
        switchers[switchersCount - 2 - i].classList.add('switch__item_disabled');
        switchers[leftElement - i].classList.remove('switch__item_disabled');
    }
    let rightDelimer = createDelimer()
    switchers[switchersCount].insertAdjacentElement('beforebegin', rightDelimer);
    return;
}

function renderBetweenTwoDelimersRightMove(selectedSwitcher, prevSelectedSwitcher) {
    countBetween = selectedSwitcher - prevSelectedSwitcher;
    for (let i = 1; i <= countBetween; i++) {
        switchers[prevSelectedSwitcher + 2 + i].classList.remove('switch__item_disabled');
        switchers[prevSelectedSwitcher - 3 + i].classList.add('switch__item_disabled');
    }

    if (selectedSwitcher + 5 >= switchersCount) {
        switchers[switchersCount].previousSibling.remove();
        for (let i = switchersCount - 1; i >= switchersCount - 7; i--) {
            switchers[i].classList.remove('switch__item_disabled');
        }
    }
}

function renderBetweenTwoDelimersLeftMove(selectedSwitcher, prevSelectedSwitcher) {
    countBetween = prevSelectedSwitcher - selectedSwitcher;
    for (let i = 1; i <= countBetween; i++) {
        switchers[prevSelectedSwitcher - 2 - i].classList.remove('switch__item_disabled');
        switchers[prevSelectedSwitcher + 3 - i].classList.add('switch__item_disabled');
    }

    if (selectedSwitcher - 5 <= 0) {
        switchers[0].nextSibling.remove();
        for (let i = 1; i <= 7; i++) {
            switchers[i].classList.remove('switch__item_disabled');
        }
    }
}

function renderSelectLast() {
    if (switchers[0].nextSibling.id != 'delimer') {
        let delimer = createDelimer();
        switchers[0].insertAdjacentElement('afterend', delimer);
    }
    if (switchers[switchersCount].previousSibling.id === 'delimer') {
        switchers[switchersCount].previousSibling.remove();
    }
    for (let i = 1; i < switchersCount - 7; i++) {
        switchers[i].classList.add('switch__item_disabled');
    }
    for (let i = switchersCount - 7; i <= switchersCount - 1; i++) {
        switchers[i].classList.remove('switch__item_disabled');
    }
}

function renderSelectFirst() {
    if (switchers[switchersCount].previousSibling.id != 'delimer') {
        let delimer = createDelimer();
        switchers[switchersCount].insertAdjacentElement('beforebegin', delimer);
    }
    if (switchers[0].nextSibling.id === 'delimer') {
        switchers[0].nextSibling.remove();
    }
    for (let i = 1; i <= 7; i++) {
        switchers[i].classList.remove('switch__item_disabled');
    }
    for (let i = 8; i <= switchersCount - 1; i++) {
        switchers[i].classList.add('switch__item_disabled');
    }
}

function createDelimer() {
    let span = document.createElement('span');
    span.classList.add('switch__item_delimer');
    span.innerHTML = '...';
    span.id = 'delimer';
    return span;
}

function createDefaulfSpan(id) {
    let span = document.createElement('span');
    span.classList.add('switch__item');
    span.id = `switch__item ${id}`;
    span.innerHTML = id + 1;
    return span;
}

function createHeaderLi() {
    let li = document.createElement('li');
    li.classList.add('paginator__item');
    li.innerHTML = `<p>УДАЛЕНИЕ</p>
                    <p>ID</p>
                    <p>CO 2</p>
                    <p>TVOC</p>
                    <p>TIME</p>`;
    return li
}

function createDataLi(id, co, tvoc, time, i) {
    let li = document.createElement('li');
    li.classList.add('paginator__item');
    li.id = id;

    li.innerHTML = `
        <input type="checkbox" id="${id}-${i} ">
        <p>${id}</p>
        <p>${co}</p>
        <p>${tvoc}</p>
        <p>${time}</p>`;

    return li;
}

function getSwitcherId(switcher) {
    return id = parseInt(switcher.id.split(' ')[1])
}

function paginatorListInit() {
    let li = createHeaderLi();
    paginatorList.appendChild(li);

    //selected* items + items = items*(selected + 1)
    if (itemsCount * (selectedSwitcher + 1) > dataLen) {
        var last = dataLen;
        for (let i = selectedSwitcher * itemsCount; i < dataLen; i++) {

            let li = createDataLi(dataList[i].id, dataList[i].co, dataList[i].tvoc, dataList[i].time, i)
            //dostat vsex i navesit listeners
            paginatorList.appendChild(li);
        }
        getCurrentCheckBoxes(checkBoxesToSelectedPage);
        addListenersToCheckBoxes(checkBoxesToSelectedPage);
        return;
    }
    else {
        for (let i = selectedSwitcher * itemsCount; i <= itemsCount * (selectedSwitcher + 1) - 1; i++) {

            let li = createDataLi(dataList[i].id, dataList[i].co, dataList[i].tvoc, dataList[i].time, i)

            paginatorList.appendChild(li);
        }
        getCurrentCheckBoxes(checkBoxesToSelectedPage);
        addListenersToCheckBoxes(checkBoxesToSelectedPage);
        return;
    }

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getCurrentCheckBoxes(checkBoxesToSelectedPage) {
    checkboxesToSelectedPage = [];
    needRemoveItems = [];
    needRemoveItemsIndexInArray = [];
    childs = paginatorList.childNodes;
    for (let i = 1; i < childs.length; i++) {
        checkBoxesToSelectedPage.push(childs[i].childNodes[1])
    }
    return checkBoxesToSelectedPage;
}

function addListenersToCheckBoxes(checkBoxesToSelectedPage) {
    for (let checkBox of checkBoxesToSelectedPage) {
        checkBox.addEventListener('click', () => markUnmarkToDeletion(checkBox));
    }
}

function markUnmarkToDeletion(checkbox) {
    let indexes = checkbox.id.split('-');
    let result = needRemoveItems.indexOf(indexes[0]);
    if (result === -1) {
        needRemoveItems.push(indexes[0]);
        needRemoveItemsIndexInArray.push(parseInt(indexes[1]))
    }
    else {
        needRemoveItems.splice(result, 1);
        needRemoveItemsIndexInArray.splice(result, 1);
    }
    console.log(needRemoveItems, needRemoveItemsIndexInArray);
    return;
}

deletionButton.addEventListener('click', () => deleteData(needRemoveItems));

function deleteData(needRemoveItems) {
    if (usingAxios === true) {
        return
    }
    var bodyFormData = new FormData();
    bodyFormData.append('removeItems', needRemoveItems);
    var promise = axios.post('http://157.230.191.9:8085/delete_data', bodyFormData);
    removeAllChildNodes(paginatorList);
    removeAllChildNodes(paginatorSwitcher);
    promise.then((data) => {
        prevSelectedSwitcher = '';
        prevPrevSelectedSwatcher = '';
        selectedSwitcher = 0;
        switchersCount = 0;
        removeDataFromDataList(dataList, needRemoveItemsIndexInArray)
        dataLen = dataList.length;
        switchersCount = Math.ceil(dataLen / itemsCount) - 1;
        paginatorListInit();
        generateSwitchers(paginatorSwitcher, switchersCount, switchers);
        addSwitchersListeners(switchers);
        usingAxiosDeletion = false;
    });
}

function removeDataFromDataList(dataList, needRemoveItemsIndexInArray) {

    for (let i = 0; i < needRemoveItemsIndexInArray.length; i++) {
        dataList.splice(needRemoveItemsIndexInArray[i] - i, 1);
    }
    if (dataList.length === 0) {
        paginatorList.firstChild.remove();
    }
}