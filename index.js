let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
  document.querySelector("form").addEventListener("submit", handleFormSubmit);
});

// Load all expenses
function loadExpenses() {
  const expensesList = JSON.parse(localStorage.getItem("expensesList")) || [];
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  expensesList.forEach((exp) => display(exp));
}

// Handle form submit
function handleFormSubmit(event) {
  event.preventDefault();

  const amount = document.getElementById("amount").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;

  let expenses = JSON.parse(localStorage.getItem("expensesList")) || [];

  if (currentEditId !== null) {
    expenses = expenses.map((exp) => {
      if (exp.id === currentEditId) {
        return { ...exp, amount, description, category };
      }
      return exp;
    });
    currentEditId = null;
  } else {
    const newExpense = {
      id: Date.now(),
      amount,
      description,
      category,
    };
    expenses.push(newExpense);
  }

  localStorage.setItem("expensesList", JSON.stringify(expenses));
  event.target.reset();
  loadExpenses();
}

// Display one expense
function display(data) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.dataset.id = data.id;
  li.className =
    "list-group-item d-flex justify-content-between";

  // Amount
  const spanTag = document.createElement("span");
  spanTag.textContent =
    data.amount + " " + data.description + " " + data.category;

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn btn-sm btn-warning ms-2";

  editBtn.onclick = () => {
    document.getElementById("amount").value = data.amount;
    document.getElementById("description").value = data.description;
    document.getElementById("category").value = data.category;
    currentEditId = data.id;
  };

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn btn-sm btn-danger ms-2";
  deleteBtn.onclick = () => deleteExpense(data.id);

  // Append children
  li.appendChild(spanTag);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  ul.appendChild(li);
}

// Delete expense
function deleteExpense(id) {
  let expenses = JSON.parse(localStorage.getItem("expensesList")) || [];
  expenses = expenses.filter((exp) => exp.id !== id);
  localStorage.setItem("expensesList", JSON.stringify(expenses));
  loadExpenses();
}
