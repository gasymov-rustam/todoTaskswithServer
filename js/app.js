const createFormEl = document.getElementById("createToDoList");
const todosNew = document.getElementById("todosNew");
const todosProgress = document.getElementById("todosProgress");
const todosDelete = document.getElementById("todosDelete");
const wrapTodoList = document.getElementById("wrapTodoList");

let todos = [];
(async function () {
    const [todosData, todosError] = await getTodos()
    if (!todosError) {
        todos = todosData
    }
    renderByStatus(todos, todosNew, todosProgress, todosDelete);
})()

//------------------------------------------------------------------------------
wrapTodoList.addEventListener("click", async (e) => {
    const currentBtn = e.target.closest("button");
    if (currentBtn) {
        const action = currentBtn.dataset.action;
        const todoID = Number(currentBtn.closest(".todoTask").dataset.id);
        const todoIDX = todos.findIndex((todo) => todo.id === todoID);
        if (action === 'progress' || action === 'new') {
            const [updatedTodo, updatedTodoError] = await updateTodo(todoID, {
                updateAT: Date.now(),
                status: todos[todoIDX].status+1
            })
            if (!updatedTodoError) {
                todos.splice(todoIDX, 1, updatedTodo);
            }
        } else {
            const [, deletedTodoError] = await deleteTodo(todoID)
            if (!deletedTodoError) {
                todos.splice(todoIDX, 1);
            }
        }
        todos.sort((a, b) => a.title.localeCompare(b.title) || a.createdAt - b.createdAt || a.updatedAt - b.udatedAt);
        renderByStatus(todos, todosNew, todosProgress, todosDelete);
    }
});

createFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTodo = new Todo(e.target.title.value, e.target.title.value);
//------------------------------------------------------------------------------------
  
    const [createdTodo, createdTodoError] = await createTodo(newTodo)
    if (!createdTodoError) {
        todos.push(createdTodo);
    }

//------------------------------------------------------------------------------------

    todos.sort((a, b) => a.title.localeCompare(b.title) || a.createdAt - b.createdAt || a.updatedAt - b.udatedAt);
    const columnFirst = todos.filter((todo) => todo.status === 0);
    renderTodos(todosNew, columnFirst);
    e.target.reset();
});

function renderTodos(elem, array) {
    elem.innerHTML = createTodosHTML(array).join("");
}

function createTodosHTML(todos) {
    return todos.map((todo) => createTodoHTML(todo));
}

function createTodoHTML(todo) {
    let actionBtn = "";
    switch (todo.status) {
        case 0:
            actionBtn = `<button data-action="new">Set in progress!</button>`;
            break;
        case 1:
            actionBtn = `<button data-action="progress">Set in done!</button>`;
            break;
        case 2:
            actionBtn = `<button data-action="done">Delete!</button>`;
            break;
    }

    return `<div class="todoTask ${createTodoStatus(todo.status)}" data-id="${todo.id}">
                <h2>${todo.title}</h2>
                ${todo.body ? `<p>${todo.body}</p>` : ""}
                <p>status: ${createTodoStatus(todo.status)}</p>
                <time>Created: ${new Date(todo.createdAt).toDateString()}</time>
                ${todo.updated ? `<time>Updated: ${new Date(todo.updatedAt).toDateString()}</time>` : ""}
                ${actionBtn}
            </div>`;
}

function Todo(title, body) {
    this.title = title;
    this.body = body;
    this.status = 0;
    this.createdAt = Date.now();
    this.udatedAt = null;
}

function createTodoStatus(status) {
    if (!isNaN(Number(status))) {
        switch (Number(status)) {
            case 0:
                return "new";
            case 1:
                return "progress";
            case 2:
                return "done";
            default:
                throw "Unknown command";
        }
    } else {
        switch (status) {
            case "new":
                return 0;
            case "progress":
                return 1;
            case "done":
                return 2;
            default:
                throw "Unknown command";
        }
    }
}

function renderByStatus(todos, sectionFirst, sectionSecond, sectionThird) {
    const columnFirst = todos.filter((todo) => todo.status === 0);
    const columnSecond = todos.filter((todo) => todo.status === 1);
    const columnThird = todos.filter((todo) => todo.status === 2);
    renderTodos(sectionFirst, columnFirst);
    renderTodos(sectionSecond, columnSecond);
    renderTodos(sectionThird, columnThird);
}
