const todoBoxes = document.getElementsByClassName("TodoBoxes")[0]
const todoInput = document.getElementsByClassName("create-todo")[0]
const container = document.getElementsByClassName("container")[0]
const head = document.getElementsByClassName('head')[0]
let filterState = 1;
let isDark = '';
let arr = [];
if (localStorage.getItem('todo') === null) {
    arr = [
        {
            name: "varzesh",
            done: false,
        }
        ,
        {
            name: "tamrin",
            done: true,
        }
        ,
        {
            name: "motaalea",
            done: false,
        }
    ]
} else {
    arr = JSON.parse(localStorage.getItem('todo'))
}

if (localStorage.getItem('setTime') === null) {
    isDark = false;
} else {
    isDark = JSON.parse(localStorage.getItem('setTime'))
}

todoInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleInput(event)
        event.target.value = ""
    }
})

function buildTodo(obj) {
    return (`
        <div class="TodoBox todoDrag" draggable="true" onclick="checked('${obj.name}')">
            <div class="circle" >
            </div>
            <p>${obj.name}</p>
            <img class="icon-crass" src="../res/image/cross-icon.svg" onclick="handleDelete('${obj.name}')" alt="delete">
        </div>
        `)
}

function buildTodoDone(obj) {
    return (`
        <div class="TodoBox todoDrag" draggable="true" onclick="checked('${obj.name}')">
            <div class="circle circleDone" >
            <img class="icon-done" src="../res/image/icon-done.svg" alt="done">
            </div>
            <p class="pDone">${obj.name}</p>
            <img class="icon-crass" src="../res/image/cross-icon.svg" onclick="handleDelete('${obj.name}')" alt="delete">
        </div>
        `)
}

function night() {
    return (`
        <h1>TODO</h1>
        <img src="./res/image/icon-sun.png" style="width: 30px" onclick="setTime()">
    `)
}

function day() {
    return (`
        <h1>TODO</h1>
        <img src="./res/image/icon-moon.png" style="width: 30px" onclick="setTime()">
    `)
}

const generateList = (arrInfo) => {
    return (arrInfo.map((item) => {
            return (
                item['done'] ? (buildTodoDone(item)) : (buildTodo(item))
            )
        }).join(" ")
    )
}

todoBoxes.innerHTML = generateList(arr);

const handleInput = (event) => {
    if (event.target.value === '' || event.target.value === ' ') return;
    let obj = {name: "", done: false}
    obj.name = event.target.value;
    arr.push(obj)
    if (filterState === 1) showAll();
    if (filterState === 2) showActive();
    if (filterState === 3) showCompleted();
}

function checked(todoName) {
    for (let item of arr) {
        if (item['name'] === todoName) {
            item['done'] ? item['done'] = false : item['done'] = true
        }
    }
    if (filterState === 1) showAll();
    if (filterState === 2) showActive();
    if (filterState === 3) showCompleted();
}

function handleDelete(todoName) {
    let i = 0;
    for (let item of arr) {
        if (item['name'] === todoName) {
            arr.splice(i, 1)
        }
        i++;
    }
    if (filterState === 1) showAll();
    if (filterState === 2) showActive();
    if (filterState === 3) showCompleted();
}

function itemsLeft() {
    document.getElementById('itemsLeft').innerHTML = `${arr.length} items left`
}

function showAll() {
    todoBoxes.innerHTML = generateList(arr);
    filterState = 1;
    itemsLeft()
    localStorage.setItem('todo', JSON.stringify(arr))
    localTodo()
    dragAndDrop()
}

function showActive() {
    todoBoxes.innerHTML = generateList(arr.filter((item) => item['done'] === false));
    filterState = 2;
    itemsLeft()
    localStorage.setItem('todo', JSON.stringify(arr))
    localTodo()
    dragAndDrop()
}

function showCompleted() {
    todoBoxes.innerHTML = generateList(arr.filter((item) => item['done'] === true));
    filterState = 3;
    itemsLeft()
    localStorage.setItem('todo', JSON.stringify(arr))
    localTodo()
    dragAndDrop()
}

function clearCompleted() {
    let arr1 = [];
    for (let item of arr) {
        if (item['done'] === false) {
            arr1.push(item)
        }
    }
    arr = arr1;
    if (filterState === 1) showAll();
    if (filterState === 2) showActive();
    if (filterState === 3) showCompleted();
}

function setTime() {
    isDark = !isDark;
    setTheme()
    localStorage.setItem('setTime', JSON.stringify(isDark))
}

function setTheme() {
    isDark ? (container.style.background = 'darkblue') : (container.style.background = 'lightblue');
    isDark ? (head.innerHTML = night()) : (head.innerHTML = day())
}

function localTodo() {
    arr = JSON.parse(localStorage.getItem('todo'))
}

itemsLeft()
setTheme()

function dragAndDrop() {
    document.addEventListener('DOMContentLoaded', (event) => {

        function handleDragStart(e) {
            this.style.opacity = '0.4';
            dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragEnd(e) {
            this.style.opacity = '1';

            items.forEach(function (item) {
                item.classList.remove('over');
            });
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            return false;
        }

        function handleDragEnter(e) {
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');
        }

        function handleDrop(e) {
            e.stopPropagation();

            if (dragSrcEl !== this) {
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }

            return false;
        }

        let items = document.querySelectorAll('.todoDrag ');
        items.forEach(function (item) {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('drop', handleDrop);
        });
    });
}

dragAndDrop()
