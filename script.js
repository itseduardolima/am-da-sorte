// Estado global
let marcados = new Set();
let cartelas = []; // array de objetos { id, nums }
let proximoId = 1;

// ── Renderiza o painel 1–60 ──
function renderPainel() {
  const painel = document.getElementById('painel');
  painel.innerHTML = '';
  for (let n = 1; n <= 60; n++) {
    const btn = document.createElement('div');
    btn.className = 'painel-num' + (marcados.has(n) ? ' marcado' : '');
    btn.textContent = n;
    btn.dataset.num = n;
    btn.addEventListener('click', () => toggleNumero(n));
    painel.appendChild(btn);
  }
}

// ── Marca/desmarca número no painel e propaga às cartelas ──
function toggleNumero(n) {
  if (marcados.has(n)) {
    marcados.delete(n);
  } else {
    marcados.add(n);
  }
  atualizarPainelNum(n);
  document.getElementById('qtd-marcados').textContent = marcados.size;
  renderCartelas();
}

function atualizarPainelNum(n) {
  const btn = document.querySelector(`.painel-num[data-num="${n}"]`);
  if (!btn) return;
  btn.classList.toggle('marcado', marcados.has(n));
}

function atualizarCartelasNum(n) {
  document.querySelectorAll(`.cartela-cell[data-num="${n}"]`).forEach(cell => {
    cell.classList.toggle('marcado', marcados.has(n));
  });
}

// ── Gera uma cartela com 20 números (4 por coluna) ──
function gerarCartela() {
  const faixas = [
    [1, 12],
    [13, 24],
    [25, 36],
    [37, 48],
    [49, 60],
  ];
  const nums = [];
  for (const [min, max] of faixas) {
    const pool = [];
    for (let i = min; i <= max; i++) pool.push(i);
    // Embaralha e pega 4
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    nums.push(...pool.slice(0, 4));
  }
  // Reorganiza: linha por linha (col1-row1, col2-row1, ..., col5-row4)
  // nums está organizado por coluna [c1r1,c1r2,c1r3,c1r4, c2r1,..., c5r4]
  const porLinha = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      porLinha.push(nums[col * 4 + row]);
    }
  }
  return porLinha;
}

// ── Renderiza as cartelas ──
function renderCartelas() {
  const container = document.getElementById('cartelas-container');
  const header = document.getElementById('cartelas-header');
  const qtdSpan = document.getElementById('qtd-cartelas-geradas');

  if (cartelas.length === 0) {
    container.innerHTML = '<div class="empty-state">Escolha a quantidade de cartelas e clique em "Gerar Cartelas"</div>';
    header.style.display = 'none';
    return;
  }

  header.style.display = 'block';
  qtdSpan.textContent = cartelas.length;
  container.innerHTML = '';

  const ordenadas = [...cartelas].sort((a, b) => {
    const marcadosA = a.nums.filter(n => marcados.has(n)).length;
    const marcadosB = b.nums.filter(n => marcados.has(n)).length;
    return marcadosB - marcadosA;
  });

  ordenadas.forEach(({ id, nums }) => {
    const cartela = document.createElement('div');
    cartela.className = 'cartela';

    const titulo = document.createElement('div');
    titulo.className = 'cartela-titulo';
    titulo.textContent = `Cartela #${id}`;
    cartela.appendChild(titulo);

    const table = document.createElement('div');
    table.className = 'cartela-table';

    nums.forEach(n => {
      const cell = document.createElement('div');
      cell.className = 'cartela-cell' + (marcados.has(n) ? ' marcado' : '');
      cell.textContent = n;
      cell.dataset.num = n;
      table.appendChild(cell);
    });

    cartela.appendChild(table);
    container.appendChild(cartela);
  });
}

// ── Botões ──
function gerarCartelas() {
  const qtd = parseInt(document.getElementById('qtd-cartelas').value, 10);
  if (isNaN(qtd) || qtd < 1) return;
  cartelas = [];
  proximoId = 1;
  for (let i = 0; i < qtd; i++) {
    cartelas.push({ id: proximoId++, nums: gerarCartela() });
  }
  renderCartelas();
}

function limparMarcacoes() {
  marcados.clear();
  document.getElementById('qtd-marcados').textContent = 0;
  renderPainel();
  document.querySelectorAll('.cartela-cell.marcado').forEach(c => c.classList.remove('marcado'));
}

function novaRodada() {
  marcados.clear();
  cartelas = [];
  proximoId = 1;
  document.getElementById('qtd-marcados').textContent = 0;
  renderPainel();
  renderCartelas();
}

// ── Init ──
renderPainel();
