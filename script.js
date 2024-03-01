// Selecting DOM elements
const container = document.querySelector(".container");
const btn = document.getElementById("btn");
const inputContainer = document.querySelector(".input-container");
const inputField = document.querySelector(".input-field");
const descriptionField = document.querySelector(".description-field");
const deadlineField = document.querySelector(".deadline-field");
const priorityField = document.querySelector(".priority-field");
const sortByNameBtn = document.querySelector(".sort-name");
const sortByCrdBtn = document.querySelector(".sort-crd");
const sortByDeadlineBtn = document.querySelector(".sort-deadline");
const sortByPriorityBtn = document.querySelector(".sort-priority");
// Adding event listeners
const toggleBtn = document.getElementById("dark-mode-toggle-btn");
const toggleIcon = document.getElementById("toggle-icon");

let isDarkMode = false;

toggleBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    toggleIcon.classList.remove("fa-toggle-off");
    toggleIcon.classList.add("fa-toggle-on");
  } else {
    document.body.classList.remove("dark-mode");
    toggleIcon.classList.remove("fa-toggle-on");
    toggleIcon.classList.add("fa-toggle-off");
  }
});
inputContainer.addEventListener("keyup", handleEnterKey);
container.addEventListener("click", addEventHandler);
// btn.addEventListener("click", (e)=>{
//   e.preventDefault();
//   saveTodo();
// });
sortByNameBtn.addEventListener("click", () => {
  handleSortClick("name");
});
sortByCrdBtn.addEventListener("click", () => {
  handleSortClick("crd");
});
sortByDeadlineBtn.addEventListener("click", () => {
  handleSortClick("deadline");
});
sortByPriorityBtn.addEventListener("click", () => {
  handleSortClick("priority");
});
// Function to handle 'Enter' key press
function handleEnterKey(e) {
  if (e.keyCode === 13) {
    saveTodo();
  }
}

// Function to handle click events on todo items
function addEventHandler(e) {
  const todo = e.target.closest(".todo");

  if (!todo) return;

  if (e.target.classList.contains("fa-trash")) {
    // Remove todo item
    todo.remove();
    removeFromLocalStorage(getTodoID(todo)); // Remove from local storage
    return;
  }
  if (e.target.classList.contains("fa-edit")) {
    // Enable editing of todo item
    const textSpan = todo.querySelector("span[contenteditable=false]");
    textSpan.contentEditable = true;
    textSpan.focus();
    return;
  }
  if (
    e.target.classList.contains("fa-check") ||
    e.target.classList.contains("fa-times")
  ) {
    // Toggle completion status of todo item
    todo.classList.toggle("completed");
    e.target.classList.toggle("fa-times");
    e.target.classList.toggle("fa-check");
    toggleTodoCompleteStatus(getTodoID(todo)); // Update in local storage
  }
}

// Function to get the ID of a todo item
function getTodoID(todo) {
  return todo.querySelector(".todo-id").textContent;
}

// Function to save a todo item
function saveTodo() {
  if (
    inputField.value !== "" &&
    descriptionField.value !== "" &&
    deadlineField.value !== "" &&
    priorityField.value !== "" // Ensure priority is selected
  ) {
    // Save todo to local storage
    const todo = saveToLocalStorage(
      inputField.value,
      descriptionField.value,
      deadlineField.value,
      priorityField.value // Pass priority value
    );
    container.insertAdjacentHTML("beforeend", getTodoHTML(todo)); // Insert into DOM
    inputField.value = "";
    descriptionField.value = "";
    deadlineField.value = "";
    priorityField.value = ""; // Reset priority field

    // Sort and render todos based on current sorting method
    const sortMethod = getSortMethod();
    sortAndRender(sortMethod);
  } else {
    alert("Please fill in all fields, including priority");
  }
}

// Function to determine current sorting method
function getSortMethod() {
  if (sortByNameBtn.classList.contains("active")) {
    return "name";
  } else if (sortByCrdBtn.classList.contains("active")) {
    return "crd";
  } else if (sortByDeadlineBtn.classList.contains("active")) {
    return "deadline";
  }
}

// Function to sort and render todos
function sortAndRender(sortMethod) {
  if (sortMethod === "name") {
    sortByName();
  } else if (sortMethod === "crd") {
    sortByCreationDate();
  } else if (sortMethod === "deadline") {
    sortByDeadline();
  } else if (sortMethod === "priority") {
    sortByPriority();
  }
}

// Function to save todo to local storage
function saveToLocalStorage(todoText, description, deadline, priority) {
  let todos = readFromLocalStorage();

  if (!todos) todos = [];

  const todo = {
    id: Date.now(),
    text: todoText,
    description: description,
    deadline: deadline,
    priority: priority, // Save priority
    completed: false,
  };
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));

  return todo;
}

// Function to read todos from local storage
function readFromLocalStorage() {
  const todos = localStorage.getItem("todos");
  return todos ? JSON.parse(todos) : [];
}

// Function to remove todo from local storage
function removeFromLocalStorage(todoID) {
  let todos = readFromLocalStorage();
  todos = todos.filter((t) => t.id != todoID);

  if (todos.length === 0) {
    localStorage.removeItem("todos");
    return;
  }

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to toggle completion status of todo in local storage
function toggleTodoCompleteStatus(todoID) {
  let todos = readFromLocalStorage();

  todos = todos.map((t) => {
    if (t.id == todoID) t.completed = !t.completed;
    return t;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to generate HTML for a todo item
function getTodoHTML(todo) {
  return `
      <div class="${todo.completed ? "todo completed" : "todo"}">
        <span>
          <span class="todo-id">${todo.id}</span>
          <span contenteditable="false" class="editable" tabindex=1>${
            todo.text
          }</span>
        </span>
        <div class="todo-details">
          <p>Description: <span contenteditable="true" class="editable">${
            todo.description
          }</span></p>
          <p>Deadline: <span contenteditable="true" class="editable">${formatDate(
            todo.deadline
          )}</span></p>
          <p>Creation: <span >${formatDate(todo.id)}</span></p>
          <p>Priority: <span contenteditable="true" class="editable">${
            todo.priority
          }</span></p>
        </div>
        <div class="todo-actions">
          <i class="fas fa-edit"></i>
          <i class="${todo.completed ? "fas fa-times" : "fas fa-check"}"></i>
          <i class="fas fa-trash"></i>
        </div>
      </div>
  `;
}
function formatDate(date) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
}

// Function to initialize the application
function initApp() {
  const todos = readFromLocalStorage();
  if (todos.length === 0) return;

  // Insert todos into DOM
  todos.forEach((t) =>
    container.insertAdjacentHTML("beforeend", getTodoHTML(t))
  );

  // Add event listeners for editing todos
  container.querySelectorAll(".editable").forEach((editableField) => {
    editableField.addEventListener("input", () => {
      const todoID = editableField
        .closest(".todo")
        .querySelector(".todo-id").textContent;
      updateTodoDetails(todoID);
    });

    editableField.addEventListener("blur", () => {
      editableField.contentEditable = false;
    });
  });
}

// Function to update todo details in local storage
function updateTodoDetails(todoID) {
  let todos = readFromLocalStorage();
  const todoElement = document.querySelectorAll(".editable");
  todoElement.forEach((t) => {
    const id =
      t.parentElement.parentElement.querySelector(".todo-id").textContent;
   
    todos.forEach((x) => {
      if (x.id == todoID) {
        console.log(x);
        console.log(
          t.parentElement.parentElement.querySelectorAll(".editable")
        );
        x.text =
          t.parentElement.parentElement.querySelectorAll(
            ".editable"
          )[0].textContent;
        x.description =
          t.parentElement.parentElement.querySelectorAll(
            ".editable"
          )[1].textContent;
        x.deadline = formatDate(
          t.parentElement.parentElement.querySelectorAll(".editable")[2]
            .textContent
        );
        x.priority =
          t.parentElement.parentElement.querySelectorAll(
            ".editable"
          )[3].textContent;
      }
      localStorage.setItem("todos", JSON.stringify(todos));
    });
    // }
  });
  // localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to sort todos by name
function sortByName() {
  const todos = readFromLocalStorage();
  todos.sort((a, b) => a.text.localeCompare(b.text));
  renderTodos(todos);
}

// Function to sort todos by creation date
function sortByCreationDate() {
  const todos = readFromLocalStorage();
  todos.sort((a, b) => a.id - b.id);
  renderTodos(todos);
}

// Function to sort todos by deadline
function sortByDeadline() {
  const todos = readFromLocalStorage();
  todos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  renderTodos(todos);
}
function sortByPriority() {
  const todos = readFromLocalStorage();
  const priorityValues = {
    low: 1,
    medium: 2,
    high: 3,
  };
  todos.sort((a, b) => priorityValues[a.priority] - priorityValues[b.priority]);
  renderTodos(todos);
}

// Function to render todos
function renderTodos(todos) {
  let todo = container.querySelectorAll(".todo");

  todo.forEach((t) => t.remove());
  todos.forEach((todo) =>
    container.insertAdjacentHTML("beforeend", getTodoHTML(todo))
  );
}

// Function to handle click events for sorting
function handleSortClick(sortType) {
  console.log("Sort button clicked:", sortType);
  const sortButtons = document.querySelectorAll(".sort-btn button");
  sortButtons.forEach((button) => {
    button.classList.remove("active");
  });
  const activeSortButton = document.querySelector(
    `.sort-btn .sort-${sortType}`
  );
  activeSortButton.classList.add("active");
  sortAndRender(sortType);
}

// JavaScript for toggling theme
// Function to toggle between light and dark themes
const toggleDarkMode = () => {
  document.body.classList.toggle("dark");
};

// Event listener for the dark mode toggle button
const darkModeToggleBtn = document.getElementById("dark-mode-toggle-btn");
darkModeToggleBtn.addEventListener("click", toggleDarkMode);

// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btnOpenModal = document.getElementById("btnOpenModal");

// Get the <span> element that closes the modal
const spanClose = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btnOpenModal.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
spanClose.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// Event listener for modal form submission
const modalForm = document.getElementById("modal-input-container");
modalForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission
  saveTodo(); // Call the saveTodo function
  modal.style.display = "none"; // Close the modal after saving todo
});

// Initialize the application

initApp();
