document.addEventListener("DOMContentLoaded", () => {
  setToggleIcon();
  const toggleBtn = document.getElementById("toggle-dark-mode");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleDarkMode);
  }
  // Página de Despesas
  if (document.getElementById("expense-form")) {
    document.getElementById("expense-form").addEventListener("submit", function(e) {
      e.preventDefault();
      addExpense();
    });
    loadExpenses();
  }
  // Página de Receitas
  if (document.getElementById("revenue-form")) {
    document.getElementById("revenue-form").addEventListener("submit", function(e) {
      e.preventDefault();
      addRevenue();
    });
    loadRevenues();
  }
  // Página de Resumo
  if (document.getElementById("summary")) {
    loadSummary();
  }
  // Página de Gráficos
  if (document.getElementById("expensesChart") &&
      document.getElementById("revenuesChart") &&
      document.getElementById("totalChart")) {
    loadCharts();
  }
});

// ––– Modo Escuro –––
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  setToggleIcon();
}

function setToggleIcon() {
  const btn = document.getElementById("toggle-dark-mode");
  if (!btn) return;
  
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", isDarkMode);

  btn.innerHTML = isDarkMode ? getSunIcon() : getMoonIcon();
}

function getSunIcon() {
  return `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="4" stroke-width="2"></line>
      <line x1="12" y1="20" x2="12" y2="23" stroke-width="2"></line>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke-width="2"></line>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke-width="2"></line>
      <line x1="1" y1="12" x2="4" y2="12" stroke-width="2"></line>
      <line x1="20" y1="12" x2="23" y2="12" stroke-width="2"></line>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke-width="2"></line>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke-width="2"></line>
    </svg>
  `;
}
function getMoonIcon() {
  return `
    <svg viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  `;
}

// ––– Despesas –––
function getExpenses() {
  return JSON.parse(localStorage.getItem("despesas")) || [];
}
function saveExpenses(expenses) {
  localStorage.setItem("despesas", JSON.stringify(expenses));
}
function addExpense() {
  const desc = document.getElementById("expense-desc").value.trim();
  const valueStr = document.getElementById("expense-value").value.replace(",", ".").trim();
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;
  if (!desc || !valueStr || !date || isNaN(valueStr) || parseFloat(valueStr) <= 0) {
    alert("Por favor, preencha todos os campos com valores válidos.");
    return;
  }
  const expense = {
    descricao: desc,
    valor: parseFloat(valueStr),
    categoria: category,
    data: date
  };
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
  clearExpenseFields();
  loadExpenses();
}
function loadExpenses() {
  const expenses = getExpenses();
  const tbody = document.querySelector("#expense-table tbody");
  tbody.innerHTML = "";
  expenses.forEach((exp, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.descricao}</td>
      <td>R$ ${exp.valor.toFixed(2)}</td>
      <td>${exp.categoria}</td>
      <td>${exp.data}</td>
      <td><button class="remove-btn" onclick="removeExpense(${index})">❌</button></td>
    `;
    tbody.appendChild(row);
  });
}
function removeExpense(index) {
  let expenses = getExpenses();
  expenses.splice(index, 1);
  saveExpenses(expenses);
  loadExpenses();
}
function clearExpenseFields() {
  document.getElementById("expense-desc").value = "";
  document.getElementById("expense-value").value = "";
  document.getElementById("expense-category").value = "Alimentação";
  document.getElementById("expense-date").value = "";
}

// ––– Receitas –––
function getRevenues() {
  return JSON.parse(localStorage.getItem("receitas")) || [];
}
function saveRevenues(revenues) {
  localStorage.setItem("receitas", JSON.stringify(revenues));
}
function addRevenue() {
  const desc = document.getElementById("revenue-desc").value.trim();
  const valueStr = document.getElementById("revenue-value").value.replace(",", ".").trim();
  const category = document.getElementById("revenue-category").value;
  const date = document.getElementById("revenue-date").value;
  if (!desc || !valueStr || !date || isNaN(valueStr) || parseFloat(valueStr) <= 0) {
    alert("Por favor, preencha todos os campos com valores válidos.");
    return;
  }
  const revenue = {
    descricao: desc,
    valor: parseFloat(valueStr),
    categoria: category,
    data: date
  };
  const revenues = getRevenues();
  revenues.push(revenue);
  saveRevenues(revenues);
  clearRevenueFields();
  loadRevenues();
}
function loadRevenues() {
  const revenues = getRevenues();
  const tbody = document.querySelector("#revenue-table tbody");
  tbody.innerHTML = "";
  revenues.forEach((rev, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${rev.descricao}</td>
      <td>R$ ${rev.valor.toFixed(2)}</td>
      <td>${rev.categoria}</td>
      <td>${rev.data}</td>
      <td><button class="remove-btn" onclick="removeRevenue(${index})">❌</button></td>
    `;
    tbody.appendChild(row);
  });
}
function removeRevenue(index) {
  let revenues = getRevenues();
  revenues.splice(index, 1);
  saveRevenues(revenues);
  loadRevenues();
}
function clearRevenueFields() {
  document.getElementById("revenue-desc").value = "";
  document.getElementById("revenue-value").value = "";
  document.getElementById("revenue-category").value = "Salário";
  document.getElementById("revenue-date").value = "";
}

// ––– Resumo –––
function loadSummary() {
  const expenses = getExpenses();
  const revenues = getRevenues();
  
  // Agrupa despesas por categoria
  let expenseByCat = {};
  expenses.forEach(exp => {
    if (!expenseByCat[exp.categoria]) {
      expenseByCat[exp.categoria] = 0;
    }
    expenseByCat[exp.categoria] += exp.valor;
  });
  
  // Agrupa receitas por categoria
  let revenueByCat = {};
  revenues.forEach(rev => {
    if (!revenueByCat[rev.categoria]) {
      revenueByCat[rev.categoria] = 0;
    }
    revenueByCat[rev.categoria] += rev.valor;
  });
  
  // Monta a tabela detalhada de despesas
  let expenseHTML = "<table><thead><tr><th>Categoria</th><th>Total (R$)</th></tr></thead><tbody>";
  let totalExpenses = 0;
  for (let cat in expenseByCat) {
    let catTotal = expenseByCat[cat];
    totalExpenses += catTotal;
    expenseHTML += `<tr><td>${cat}</td><td>R$ ${catTotal.toFixed(2)}</td></tr>`;
  }
  expenseHTML += `<tr><td><strong>Total</strong></td><td><strong>R$ ${totalExpenses.toFixed(2)}</strong></td></tr>`;
  expenseHTML += "</tbody></table>";
  
  // Monta a tabela detalhada de receitas
  let revenueHTML = "<table><thead><tr><th>Categoria</th><th>Total (R$)</th></tr></thead><tbody>";
  let totalRevenues = 0;
  for (let cat in revenueByCat) {
    let catTotal = revenueByCat[cat];
    totalRevenues += catTotal;
    revenueHTML += `<tr><td>${cat}</td><td>R$ ${catTotal.toFixed(2)}</td></tr>`;
  }
  revenueHTML += `<tr><td><strong>Total</strong></td><td><strong>R$ ${totalRevenues.toFixed(2)}</strong></td></tr>`;
  revenueHTML += "</tbody></table>";
  
  let balance = totalRevenues - totalExpenses;
  
  document.getElementById("expense-summary").innerHTML = expenseHTML;
  document.getElementById("revenue-summary").innerHTML = revenueHTML;
  document.getElementById("totals").innerHTML = `
    <p><strong>Total de Despesas:</strong> R$ ${totalExpenses.toFixed(2)}</p>
    <p><strong>Total de Receitas:</strong> R$ ${totalRevenues.toFixed(2)}</p>
    <p><strong>Saldo:</strong> R$ ${balance.toFixed(2)}</p>
  `;
}

// ––– Gráficos –––
function loadCharts() {
  // Despesas por categoria
  const expenses = getExpenses();
  let expenseByCat = {};
  expenses.forEach(exp => {
    if (!expenseByCat[exp.categoria]) expenseByCat[exp.categoria] = 0;
    expenseByCat[exp.categoria] += exp.valor;
  });
  const expenseLabels = Object.keys(expenseByCat);
  const expenseData = Object.values(expenseByCat).map(val => parseFloat(val.toFixed(2)));
  
  // Receitas por categoria
  const revenues = getRevenues();
  let revenueByCat = {};
  revenues.forEach(rev => {
    if (!revenueByCat[rev.categoria]) revenueByCat[rev.categoria] = 0;
    revenueByCat[rev.categoria] += rev.valor;
  });
  const revenueLabels = Object.keys(revenueByCat);
  const revenueData = Object.values(revenueByCat).map(val => parseFloat(val.toFixed(2)));
  
  // Totais gerais
  const totalExpenses = expenses.reduce((acc, cur) => acc + cur.valor, 0);
  const totalRevenues = revenues.reduce((acc, cur) => acc + cur.valor, 0);
  const balance = totalRevenues - totalExpenses;
  
  // Gráfico de Despesas (Pie)
  const ctxExpenses = document.getElementById("expensesChart").getContext("2d");
  new Chart(ctxExpenses, {
    type: 'pie',
    data: {
      labels: expenseLabels,
      datasets: [{
        label: 'Despesas por Categoria',
        data: expenseData,
        backgroundColor: generateColors(expenseLabels.length),
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      }
    }
  });
  
  // Gráfico de Receitas (Pie)
  const ctxRevenues = document.getElementById("revenuesChart").getContext("2d");
  new Chart(ctxRevenues, {
    type: 'pie',
    data: {
      labels: revenueLabels,
      datasets: [{
        label: 'Receitas por Categoria',
        data: revenueData,
        backgroundColor: generateColors(revenueLabels.length),
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      }
    }
  });
  
  // Gráfico Total e Saldo (Bar)
  const ctxTotal = document.getElementById("totalChart").getContext("2d");
  new Chart(ctxTotal, {
    type: 'bar',
    data: {
      labels: ['Total Despesas', 'Total Receitas', 'Saldo'],
      datasets: [{
        label: 'Valores (R$)',
        data: [totalExpenses.toFixed(2), totalRevenues.toFixed(2), balance.toFixed(2)],
        backgroundColor: [
          'rgba(220,53,69,0.7)',    // Despesas
          'rgba(40,167,69,0.7)',     // Receitas
          'rgba(23,162,184,0.7)'     // Saldo
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
  });
}

// Função auxiliar para gerar cores aleatórias
function generateColors(n) {
  let colors = [];
  for (let i = 0; i < n; i++) {
    colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
  }
  return colors;
}
