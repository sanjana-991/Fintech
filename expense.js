const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");

// LOAD EXPENSES FROM LOCAL STORAGE
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// FIXED MONTHLY INCOME
const totalIncome = 50000;

// CHART INSTANCES
let barChart, pieChart;

// ADD EXPENSE FUNCTION
function addExpense() {
  const title = titleInput.value;
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!title || !amount) {
    alert("Fill all fields");
    return;
  }

  expenses.push({ title, amount, category });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  titleInput.value = "";
  amountInput.value = "";

  render();
}

// RENDER UI
function render() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  let total = 0;
  let categoryTotals = {};

  expenses.forEach(e => {
    total += e.amount;

    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${e.title} (${e.category})</span>
      <span>₹${e.amount}</span>
    `;
    list.appendChild(li);
  });

  document.getElementById("totalExpense").innerText = `₹${total}`;
  document.getElementById("balance").innerText = `₹${totalIncome - total}`;

  drawCharts(categoryTotals);
}

// DRAW CHARTS
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
      plugins: {
        legend: { display: false }
      }
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
      responsive: true
    }
  });
}

// INITIAL RENDER
render();