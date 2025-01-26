const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("expense-form");
  const tableBody = document.querySelector("#expense-table tbody");
  const totalExpenses = document.getElementById("total-expenses");

  const fetchExpenses = async () => {
    const response = await fetch(`${API_URL}/expenses`);

    const {expenses , total} = await response.json();
    renderExpenses(expenses, total) ;
  };

  const renderExpenses = (expenses , total) => {
    tableBody.innerHTML = '';
    expenses.forEach((expenses) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expenses.name}</td>
        <td>${expenses.amount}</td>
        <td>${expenses.category}</td>
        <td>${expenses.date}</td>
      `;
      tableBody.appendChild(row);
    })
    totalExpenses.textContent = `₹${total}`;
    
  };
  const addExpenses = async (expense) => {
    await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    fetchExpenses();
  };

  const deleteExpenses = async (id) => {
    await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    fetchExpenses();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    if (!description && amount > 0){
      addExpenses({description, amount});
      form.reset();
    }
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")){
      const id = e.target.getAttribute("data-id");
      deleteExpenses(id);
    }
  });

fetchExpenses();

})