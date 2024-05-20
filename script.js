"use strict";

class Todo {
  id = (Date.now() + "").slice(-10);
  constructor(todoText) {
    this.todoText = todoText;
  }
}

const form = document.querySelector("form");
const todoInput = document.getElementById("textbox");
const todoContainer = document.querySelector("section");
const todoItem = document.querySelector(".todo-item");
const editItem = document.querySelector(".edit-item");
const noTodo = document.querySelector(".no");

class App {
  #todos = [];
  constructor() {
    this.#getLocalStorage();
    this.#cont();

    form.addEventListener("submit", this.#newTodo.bind(this));
    todoContainer.addEventListener("click", this.#todoFeatures.bind(this));
  }

  #cont() {
    if (this.#todos.length > 0) {
      this.#hide();
    }
  }

  #newTodo(e) {
    e.preventDefault();
    const todoValue = todoInput.value;
    let todo;

    todo = new Todo(todoValue);

    if (!todoValue) return;

    this.#todos.push(todo);

    this.#renderTodo(todo);

    this.#hide();

    this.#setLocalStorage();
  }

  #renderTodo(todo) {
    const html = `
      <div class="todo-item" data-id="${todo.id}">
        <p class="text">${todo.todoText}</p>
        <p class="edit">Edit</p>
        <p class="delete">Delete</p>
      </div>
    `;
    todoContainer.insertAdjacentHTML("afterbegin", html);
  }

  #hide() {
    todoInput.value = "";
    noTodo.classList.add("hidden");
  }

  #todoFeatures(e) {
    this.#deleteTodo(e);
    this.#editTodo(e);
  }

  #deleteTodo(e) {
    if (e.target.classList.contains("delete")) {
      const todoEl = e.target.closest(".todo-item");
      todoEl.remove();
      const todo = this.#todos.find((t) => t.id === todoEl.dataset.id);
      const todoIndex = this.#todos.indexOf(todo);
      this.#todos.splice(todoIndex, 1);

      this.#setLocalStorage();

      if (this.#todos.length < 1) {
        noTodo.classList.remove("hidden");
      }
    }
  }

  #editTodo(e) {
    if (e.target.classList.contains("edit")) {
      const todoEl = e.target.closest(".todo-item");
      const editEl = document.createElement("div");
      const text = todoEl.querySelector(".text").textContent;

      editEl.classList.add("edit-item");
      editEl.innerHTML = `
        <input type="text" placeholder= "Update item..." value="${text}" class="edit-textbox">
        <p class="cancel">Cancel</p>
        <p class="save">Save</p>
      `;
      todoEl.replaceWith(editEl);

      const editInput = editEl.querySelector(".edit-textbox");
      editInput.focus();
      editInput.setSelectionRange(
        editInput.value.length,
        editInput.value.length
      );

      // Cancel event
      editEl
        .querySelector(".cancel")
        .addEventListener("click", () => editEl.replaceWith(todoEl));

      // Save event
      editEl.querySelector(".save").addEventListener("click", function () {
        const editText = editInput.value.trim();

        if (!editText) {
          alert("Todo text cannot be empty!");
          return;
        }

        const todo = app.#todos.find((t) => t.id === todoEl.dataset.id);
        todo.todoText = editText;
        todoEl.querySelector(".text").textContent = editText;
        editEl.replaceWith(todoEl);

        app.#setLocalStorage();
      });
    }
  }

  #setLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.#todos));
  }

  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("todos"));

    if (!data) return;

    this.#todos = data;

    this.#todos.forEach((todo) => this.#renderTodo(todo));
  }
}

const app = new App();
