import ToDo from "./todo.js";

export function renderTodo(todo) {
  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo");

  const title = document.createElement("h3");
  title.textContent = todo.task;

  const date = document.createElement("p");
  date.textContent = `Due: ${todo.duedate}`;

  todoContainer.append(title, date);

  document.querySelector("#todo-list").appendChild(todoContainer);
}
