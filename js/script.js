var globalTodoList = [];

function addTodoHandler() {
    // hint: you have to use document object of browser
    // example document.getElementById, document.createElement ....
    // google for more and understand about document object
    showModalContent();
    var p = $('#todoInputField').val();
    addToDoInList(p);
}

function clearAllBtn() {
    clearAllTodos();
}

function saveAllBtn() {
    saveAllTodos();
}

function loadFromStorage() {
    loadTodosFromStorage();
}

function addToDoInList(cardObj) {
    // if (todoTitle){
        var htmlElem = `<div class="todo-list-item">
                            <div class="status-bar ${cardObj.status}"> </div>
                            <div class="todo-list-item-title"><b>${cardObj.title}</b></div>
                            <div class="liner-title"> </div>
                            <div class="todo-list-item-description">${cardObj.desc}</div>
                        </div>`;
        /*htmlElem = htmlElem.replace('{dynamicContent}', userInput);*/
        $('#todo-list-container').append(htmlElem);

        // now clear the todo input element;
        $('#todoInputField').val('');
    // }
}

/* Hiding these Functions
    function clearAllTodos() {
    var todoListItems = document.getElementsByClassName('todo-list-item');
    while (todoListItems.length > 0) {
        todoListItems[0].remove();
        todoListItems = document.getElementsByClassName('todo-list-item');
    }
    globalTodoList = []; 
    localStorage.removeItem('todo-list-saved-contents');   
}

function saveAllTodos() {
    localStorage.setItem('todo-list-saved-contents', JSON.stringify(globalTodoList));
}

function loadTodosFromStorage() {
    var savedTodos = localStorage.getItem('todo-list-saved-contents');
    if (savedTodos) {
        savedTodos = JSON.parse(savedTodos);
    }
    for (var i=0; i<savedTodos.length; i++) {
        globalTodoList.push(savedTodos[i]);
        addToDoInList(savedTodos[i].content);
    }
}*/

function removeToDo(e) {
    if (e) {
        var targetElement = e.target.parentElement;
        targetElement.remove();
    }
}

/*Bootstrap Features added, so not needed for now
    function showModalContent() {
    $('.modal-popup').show();
    var modalContent = `<div>
                            <div id="todoColor">
                            <h3>Add Todo</h3>
                            </div>
                            <p><input id="todoInputField" placeholder="Enter description here"></p>
                            <div id="statusColor">
                            <label>Status</label>

                            </div>
                            <select id="statusSelection">
                                <option value="not-started">Not Started</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Complete</option>
                            </select>
                            <button class="btn btn-primary" id="btnSaveChanges" onclick="saveChangesModal()">Save Changes</button>
                        </div>`;
                   
                        $('.modal-popup-content').append(modalContent);
                        
                    
}
*/
function saveChangesModal() {
    var todoTitle = utils.sanitize($('#todoTitle').val());
    var todoDescription = utils.sanitize($('#todoDescription').val());
    var todoStatus = utils.sanitize($('#todoStatus').val());
    var todoAsignee = utils.sanitize($('#todoAsignee').val());
    var todoDueDate = utils.sanitize($('#todoDueDate').val());
    var todoTicketNumber = 'NTN-' + (Math.floor(10000 + Math.random() * 90000));
    var obj = {
        title: todoTitle,
        desc: todoDescription,
        status: todoStatus,
        ticketNumber: todoTicketNumber,
        dueDate: todoDueDate,
        asignee: todoAsignee
    };

    addToDoInList(obj);
    addToDoInBoard(obj);
    globalTodoList.push(obj);
    saveTasktoDataBase(obj);
    clearModal();
}

function addToDoInBoard(cardObj) {
    let statusBoardContainer = 'boardViewTodoContainer';
    let asigneeInitial = cardObj.asignee[0];
    if (cardObj.status === 'in-progress') {
        statusBoardContainer = 'boardViewInProgressContainer';
    } else if(cardObj.status === 'completed') {
        statusBoardContainer = 'boardViewDoneContainer';
    }
    let template = `<div class="status-card nir-flex-container nir-col" data-ticketnumber="${cardObj.ticketNumber}">
                        <div class="nir-flex-container nir-row nir-card-header">
                        <a href="http://localhost:5000/views/ticketdetails?tn=${cardObj.ticketNumber}&_id=${cardObj._id}" class="status-card-ticket-no">${cardObj.ticketNumber}</a>
                        <div class="status-card-avatar">
                            <span class="status-card-avatar-initial">${asigneeInitial}</span>
                        </div>
                        </div>
                        <div class="nir-card-title">${cardObj.title}</div>
                        <div class="nir-card-desc">${cardObj.desc}</div>
                        <div class="nir-card-footer">
                        <span>Due by: ${cardObj.dueDate}</span>
                        </div>
                    </div>`;
    $(`#${statusBoardContainer} .card-container`).append(template);
}

function clearBoard() {
    var cardContainers = $('.card-container');
    for (var i=0; i<cardContainers.length; i++) {
        var children = ($('.card-container')[i]).children;
        while(children.length > 0) {
            children[0].remove();
        }        
    }
}

function toggleView(ev, viewName) {
    if (viewName === 'boardView') {
        $('#todo-list-container').hide();
        $('#board-view').show();
    } else if (viewName === 'listView') {
        $('#todo-list-container').show();
        $('#board-view').hide();
    }
    if (ev) {
        $('.nir-quick-links a').removeClass('view-link-selected');
        $(ev.currentTarget).addClass('view-link-selected');
    }

}

function doFilter(ev, filterName) {
    clearBoard();
   
    if (ev) {
        $('.quick-filters a').removeClass('view-link-selected');
        $(ev.currentTarget).addClass('view-link-selected');
    }
    
    if (filterName.toLowerCase() === 'showall') {
        globalTodoList.map((cardObj) => {
            addToDoInBoard(cardObj);
            
        });
        return false;
    }
    var filteredList = globalTodoList.filter((cardObj) => {
        if (cardObj.asignee.toLowerCase() === filterName.toLowerCase()) {
            return cardObj;
        }
    });
    filteredList.map((cardObj) => {
        addToDoInBoard(cardObj);
    });
    
}



// jquery way
$(document).ready(function (){
    var drake = dragula([
        document.getElementById('todoItemMain'),
        document.getElementById('inProgressMain'),
        document.getElementById('doneMain')
    ]);

    drake.on('drop', function(el, target, source, sibling) {
        console.log(el); console.log(target); console.log(source);
        var cardTicketNumber = $(el).data('ticketnumber');
        var targetId = $(target).attr('id');
        console.log('dropped----------');
        updateGlobalTodoList(cardTicketNumber, targetId);
    });

    getAllTasksFromDataBase();
});



function updateGlobalTodoList(cardTicketNumber, targetId) {
    var newStatus = '';
    if (targetId === 'todoItemMain') {
        newStatus = 'not-started';
    } else if (targetId === 'inProgressMain') {
        newStatus = 'in-progress';
    } else if (targetId === 'doneMain') {
        newStatus = 'completed'
    }

    for (var i=0; i<globalTodoList.length; i++) {
        if (globalTodoList[i].ticketNumber.toString().trim() === cardTicketNumber.toString().trim()) {
            globalTodoList[i].status = newStatus;
            updateTaskToDataBase(globalTodoList[i]);
            break;
        }
    }
}

function getAllTasksFromDataBase() {
    fetch('http://localhost:8088/api/todo', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZjQwNDc0ZWY1MDdkNmNkZmYyZWQ4NGE0NjdiMGJiMTkyMjo5NzNhMjhjN2Q5MGQ4ZTg3M2E5OTRlMmViNDk4ZGQ0MzQ1NmF0MFBwMVQ='
        // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then((response) => response.json())
    .then((data) => {
        globalTodoList = data.result;//this is line script notation
        globalTodoList.map((task) => {
            addToDoInList(task);
            addToDoInBoard(task);
        });
    })
    .catch((err) => console.log(err));
}

function saveTasktoDataBase(taskObj) {
    fetch('http://localhost:8088/api/todo', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZjQwNDc0ZWY1MDdkNmNkZmYyZWQ4NGE0NjdiMGJiMTkyMjo5NzNhMjhjN2Q5MGQ4ZTg3M2E5OTRlMmViNDk4ZGQ0MzQ1NmF0MFBwMVQ='
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(taskObj)
    })
    .then((response) => response.json())
    .then((data) => {
       alert(data.result);
    })
    .catch((err) => console.log(err));
}
function updateTaskToDataBase(taskObj) {
    fetch(`http://localhost:8088/api/todo/${taskObj._id}`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZjQwNDc0ZWY1MDdkNmNkZmYyZWQ4NGE0NjdiMGJiMTkyMjo5NzNhMjhjN2Q5MGQ4ZTg3M2E5OTRlMmViNDk4ZGQ0MzQ1NmF0MFBwMVQ='
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(taskObj)
    })
    .then((response) => response.json())
    .then((data) => {
       alert('successful update');
    })
    .catch((err) => console.log(err));
}
function clearModal() {
    $('#todoTitle').val('');
    $('#todoDescription').val('');
    
}