const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const tableBody = document.querySelector("#expenses-table tbody");
  const totalExpenses = document.getElementById("total-expenses");

  const fetchExpenses = async () => {
    const response = await fetch(`${API_URL}/expenses`);
    const { expenses, total } = await response.json();
    renderExpenses(expenses, total);
  };

  const renderExpenses = (expenses, total) => {
    tableBody.innerHTML = "";
    expenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.id}</td>
        <td>${expense.date}</td>
        <td>${expense.description}</td>
        <td>₹${expense.amount}</td>
        <td><button data-id="${expense.id}" class="delete-btn">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });

    totalExpenses.textContent = `₹${total}`;
  };

  const addExpense = async (expense) => {
    await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`${API_URL}/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    if (description && amount > 0) {
      addExpense({ description, amount });
      form.reset();
    }
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.getAttribute("data-id");
      deleteExpense(id);
    }
  });

  fetchExpenses();
});
