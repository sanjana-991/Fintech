if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

const goalName = document.getElementById("goalName");
const charCount = document.getElementById("charCount");

goalName.addEventListener("input", () => {
  charCount.innerText = `${goalName.value.length}/30`;
});

let goals = JSON.parse(localStorage.getItem("goals")) || [];

let barChart, lineChart;

// ADD GOAL
function addGoal() {
  if (!goalName.value || !targetAmount.value) {
    alert("Fill required fields");
    return;
  }

  const goal = {
    id: Date.now(),
    name: goalName.value,
    target: Number(targetAmount.value),
    saved: Number(initialSavings.value) || 0,
    deadline: deadline.value,
    history: []
  };

  goals.push(goal);

  goalName.value = "";
  targetAmount.value = "";
  initialSavings.value = "";

  save();
}

// ADD MONEY
function addMoney(id) {
  const goal = goals.find(g => g.id === id);

  if (goal.saved >= goal.target) return; // PREVENT ADD

  const amount = Number(prompt("Enter amount"));
  if (!amount) return;

  goal.saved += amount;

  goal.history.push({
    amount,
    time: new Date()
  });

  if (goal.saved >= goal.target) {
    alert("🎉 Congratulations! Goal Achieved!");
  }

  save();
}

// DELETE
function deleteGoal(id) {
  goals = goals.filter(g => g.id !== id);
  save();
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// RENDER
function render() {
  const container = document.getElementById("goalsContainer");
  container.innerHTML = "";

  let labels = [];
  let values = [];

  goals.forEach(g => {

    const percent = (g.saved / g.target) * 100;
    const remaining = g.target - g.saved;
    const isCompleted = g.saved >= g.target;

    const daysLeft = Math.ceil(
      (new Date(g.deadline) - new Date()) / (1000*60*60*24)
    );

    const div = document.createElement("div");
    div.className = "goal-item";

    div.innerHTML = `
      <h4>${g.name}</h4>
      <p>₹${g.saved} / ₹${g.target}</p>
      <p>${percent.toFixed(1)}% • Remaining ₹${remaining < 0 ? 0 : remaining}</p>
      <p>⏳ ${daysLeft} days left</p>

      <div class="progress">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>

      <button onclick="addMoney(${g.id})" ${isCompleted ? "disabled" : ""}>
        ${isCompleted ? "Completed" : "Add"}
      </button>

      <button onclick="deleteGoal(${g.id})">Delete</button>

      <div class="history">
        ${g.history.map(h => `
          <div>₹${h.amount} - ${new Date(h.time).toLocaleString()}</div>
        `).join("")}
      </div>
    `;

    container.appendChild(div);

    labels.push(g.name);
    values.push(g.saved);
  });

  drawCharts(labels, values);
}

// CHARTS
function drawCharts(labels, values) {

  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "rgba(0,180,216,0.8)",
          "rgba(34,197,94,0.8)",
          "rgba(124,58,237,0.8)",
          "rgba(239,68,68,0.8)"
        ],
        borderRadius: 12
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      animation: { duration: 1200 }
    }
  });

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: "#00b4d8",
        backgroundColor: "rgba(0,180,216,0.2)",
        fill: true,
        tension: 0.4
      }]
    }
  });
}

// SAVE
function save() {
  localStorage.setItem("goals", JSON.stringify(goals));
  render();
}

render();
