// Função para alternar entre o modo escuro e claro
function toggleDarkMode() {
  const body = document.body;
  const currentMode = body.classList.contains('dark') ? 'dark' : 'light';

  if (currentMode === 'light') {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');  // Salva a preferência no localStorage
  } else {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');  // Salva a preferência no localStorage
  }
}

// Função para verificar e aplicar o tema salvo no localStorage
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  // Se o tema estiver salvo como 'dark', aplica o modo escuro
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

// Função para adicionar uma despesa
function adicionarDespesa() {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;
  const data = document.getElementById("data").value;
  
  if (!descricao || !valor || !categoria || !data) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Cria um novo objeto de despesa
  const despesa = {
    descricao: descricao,
    valor: valor,
    categoria: categoria,
    data: data
  };

  // Adiciona a despesa no localStorage
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  despesas.push(despesa);
  localStorage.setItem("despesas", JSON.stringify(despesas));

  // Limpa os campos do formulário
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("data").value = "";

  alert("Despesa adicionada com sucesso!");
}

// Função para adicionar uma receita
function adicionarReceita() {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;
  const data = document.getElementById("data").value;
  
  if (!descricao || !valor || !categoria || !data) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Cria um novo objeto de receita
  const receita = {
    descricao: descricao,
    valor: valor,
    categoria: categoria,
    data: data
  };

  // Adiciona a receita no localStorage
  let receitas = JSON.parse(localStorage.getItem("receitas")) || [];
  receitas.push(receita);
  localStorage.setItem("receitas", JSON.stringify(receitas));

  // Limpa os campos do formulário
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("data").value = "";

  alert("Receita adicionada com sucesso!");
}

// Função para gerar o resumo de despesas, receitas e saldo
function gerarResumo() {
  const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  const receitas = JSON.parse(localStorage.getItem("receitas")) || [];
  
  let totalDespesas = 0;
  let totalReceitas = 0;

  despesas.forEach(despesa => {
    totalDespesas += despesa.valor;
  });

  receitas.forEach(receita => {
    totalReceitas += receita.valor;
  });

  const saldo = totalReceitas - totalDespesas;

  // Preenche o resumo na página
  document.getElementById("total-despesas").innerText = `R$ ${totalDespesas.toFixed(2)}`;
  document.getElementById("total-receitas").innerText = `R$ ${totalReceitas.toFixed(2)}`;
  document.getElementById("saldo").innerText = `R$ ${saldo.toFixed(2)}`;
}

// Função para exibir a lista de despesas e receitas
function exibirDespesasReceitas() {
  const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  const receitas = JSON.parse(localStorage.getItem("receitas")) || [];

  const despesasTable = document.getElementById("despesas-tabela");
  const receitasTable = document.getElementById("receitas-tabela");

  // Exibe as despesas na tabela
  despesasTable.innerHTML = "";
  despesas.forEach(despesa => {
    const row = `<tr>
      <td>${despesa.descricao}</td>
      <td>R$ ${despesa.valor.toFixed(2)}</td>
      <td>${despesa.categoria}</td>
      <td>${despesa.data}</td>
    </tr>`;
    despesasTable.innerHTML += row;
  });

  // Exibe as receitas na tabela
  receitasTable.innerHTML = "";
  receitas.forEach(receita => {
    const row = `<tr>
      <td>${receita.descricao}</td>
      <td>R$ ${receita.valor.toFixed(2)}</td>
      <td>${receita.categoria}</td>
      <td>${receita.data}</td>
    </tr>`;
    receitasTable.innerHTML += row;
  });
}

// Função para gerar os gráficos (para gráficos, você pode usar alguma biblioteca como Chart.js)
function gerarGraficos() {
  // Exemplo de função para gerar gráficos - pode ser expandido conforme necessidade
  const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  const receitas = JSON.parse(localStorage.getItem("receitas")) || [];

  let categoriasDespesas = {};
  let categoriasReceitas = {};

  despesas.forEach(despesa => {
    if (!categoriasDespesas[despesa.categoria]) {
      categoriasDespesas[despesa.categoria] = 0;
    }
    categoriasDespesas[despesa.categoria] += despesa.valor;
  });

  receitas.forEach(receita => {
    if (!categoriasReceitas[receita.categoria]) {
      categoriasReceitas[receita.categoria] = 0;
    }
    categoriasReceitas[receita.categoria] += receita.valor;
  });

  // Aqui você pode integrar com o Chart.js ou outra biblioteca para gerar gráficos dinâmicos.
}

// Função de inicialização para cada página
function initPage() {
  applySavedTheme();  // Aplica o tema salvo ao carregar a página
}

// Executa a inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', initPage);

// Adiciona evento ao botão de alternância do modo escuro
const darkModeButton = document.getElementById('toggle-dark-mode');
if (darkModeButton) {
  darkModeButton.addEventListener('click', toggleDarkMode);
}

