const toDoUl = document.getElementById("todo-list");
let formElem = document.getElementById("newToDoForm");
let formContainer = document.getElementById("formContainer");
let newTaskBtn = document.getElementById("newTask");
const toDoItemsFromLocalStorage = JSON.parse(localStorage.getItem("toDoItems"));

const todoItems = [];

if (toDoItemsFromLocalStorage && toDoItemsFromLocalStorage.length > 0) {
  todoItems.push(...toDoItemsFromLocalStorage);
}

renderItems(todoItems, toDoUl);

newTaskBtn.addEventListener("click", () => {
  formContainer.style.display = "block";
  newTaskBtn.style.display = "none";
});

function renderItems(items, element) {
  element.innerHTML = "";
  if (items.length > 0) {
    items.forEach((item) => {
      const todeListLi = document.createElement("li");
      todeListLi.dataset.id = item.id;
      todeListLi.classList.add(
        item.priority || "low",
        item.isDone ? "done" : "notDone"
      );

      const todoLi = `
            <p class='created'>Created: ${item.date}</p>
            <p class='title'>${item.title}</p>
            <p class='description'>${item.description}</p>
            <button id='deleteBtn'><i class="fa-solid fa-trash-can"></i></button>
            ${!item.isDone ? "<button id='doneBtn'></button>" : ""}
      `;

      todeListLi.innerHTML = todoLi;
      element.appendChild(todeListLi);
    });
  } else {
    const emptyListLi = document.createElement("p");
    emptyListLi.innerText = "Your task list is empty";
    element.appendChild(emptyListLi);
  }

  const deleteBtn = document.querySelectorAll("#deleteBtn");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", deleteItem);
  });

  const doneBtn = document.querySelectorAll("#doneBtn");
  doneBtn.forEach((btn) => {
    btn.addEventListener("click", finishItem);
  });
}

formElem.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  const date = new Date();
  formProps.date = `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()}`;

  let maxId = 0;
  todoItems.forEach((item) => {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });
  formProps.id = maxId + 1;
  formProps.isDone = false;
  todoItems.push(formProps);
  renderItems(todoItems, toDoUl);
  localStorage.setItem("toDoItems", JSON.stringify(todoItems));
  formElem.reset();
  formContainer.style.display = "none";
  newTaskBtn.style.display = "block";
}

function finishItem(e) {
  e.target.parentElement.classList.add("done");
  const parentLiId = e.target.parentElement.dataset.id;
  todoItems.forEach((item) => {
    if (item.id == parentLiId) {
      item.isDone = true;
    }
  });
  localStorage.setItem("toDoItems", JSON.stringify(todoItems));
  renderItems(todoItems, toDoUl);
}

function deleteItem(e) {
  const parentLiId = e.target.parentElement.dataset.id;
  const parentIndex = todoItems.findIndex((item) => item.id == parentLiId);
  todoItems.splice(parentIndex, 1);
  localStorage.setItem("toDoItems", JSON.stringify(todoItems));
  renderItems(todoItems, toDoUl);
}

function cancelNewTask() {
  formContainer.style.display = "none";
  newTaskBtn.style.display = "block";
}
