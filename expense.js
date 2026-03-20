const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const totalIncome = 50000;

let barChart, pieChart;

// ADD EXPENSE
function addExpense() {
  const title = titleInput.value;
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!title || !amount) {
    alert("Fill all fields");
    return;
  }

  const timestamp = new Date();

  expenses.push({ title, amount, category, timestamp });

  localStorage.setItem("expenses", JSON.stringify(expenses));

  titleInput.value = "";
  amountInput.value = "";

  render();
}

// RENDER
function render() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  let total = 0;
  let categoryTotals = {};

  const now = new Date();

  const filteredExpenses = expenses
    .filter(e => {
      const d = new Date(e.timestamp);
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 7);

  filteredExpenses.forEach(e => {
    const expenseDate = new Date(e.timestamp);

    total += e.amount;

    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;

    const formattedDate = expenseDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${e.title}</strong><br>
        <small>${e.category} • ${formattedDate}</small>
      </div>
      <span>₹${e.amount}</span>
    `;

    list.appendChild(li);
  });

  document.getElementById("totalExpense").innerText = `₹${total}`;
  document.getElementById("balance").innerText = `₹${totalIncome - total}`;

  drawCharts(categoryTotals);
}

// CHARTS
function drawCharts(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#2563eb",
          "#7c3aed",
          "#22c55e",
          "#f59e0b",
          "#ef4444"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// INIT
render();
