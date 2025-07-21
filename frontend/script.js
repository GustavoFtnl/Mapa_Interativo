const selectSala = document.getElementById('locationSelect');
const imagemSala = document.querySelector('.sala');
const informacoesPainel = document.getElementById('infoPanel');
const map = document.querySelector('.map');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const wrapper = document.querySelector('.mock-map');
const zoominBtn = document.getElementById('zoominBtn');
const zoomouBtn = document.getElementById('zoomoutBtn');
const nomeLocal = document.getElementById('nomeLocal');
const pinsContainer = document.querySelector('.map-pins');
const diaDaSemanaSelect = document.getElementById('diasDaSemana');
const ulLista = document.getElementById('listaDeInformacoes');

let dadosSalas = {};
let salaAtual = '';

const minScale = 0.8;
let scale = 1;
const scaleStep = 0.2;
const maxScale = 2.5;

async function inicializarDados() {
  try {
    const response = await fetch('http://localhost:3000/api/aulas');
    if (!response.ok) throw new Error('Erro ao carregar dados da API');

    const aulas = await response.json();

    dadosSalas = {};

    aulas.forEach(({ sala, disciplina, professor, hora_inicio, hora_fim, dia_semana }) => {
      if (!dadosSalas[sala]) dadosSalas[sala] = {};
      if (!dadosSalas[sala][dia_semana]) dadosSalas[sala][dia_semana] = [];

      dadosSalas[sala][dia_semana].push({
        horario: `${hora_inicio}-${hora_fim}`,
        disciplina,
        professor
      });
    });

    if (salaAtual) {
      exibirInformacoesDaSala(salaAtual);
    }

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    ulLista.innerHTML = '<li>Falha ao carregar dados do backend.</li>';
  }
}

function exibirInformacoesDaSala(idDaSala) {
  salaAtual = idDaSala;
  const dia = diaDaSemanaSelect.value;
  ulLista.innerHTML = '';

  if (!dadosSalas[idDaSala] || !dia || dia === 'Dia') return;

  const aulas = dadosSalas[idDaSala][dia];
  if (!aulas || aulas.length === 0) {
    ulLista.innerHTML = '<li>Nenhuma aula neste dia.</li>';
    return;
  }

  const fragment = document.createDocumentFragment();
  aulas.forEach((aula) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${aula.horario}</h2>
      <h3>${aula.disciplina}</h3>
      <p>Professor: ${aula.professor}</p>`;
    fragment.appendChild(li);
  });

  ulLista.appendChild(fragment);
}

function selecionarSala(idDaSala) {
  if (!idDaSala) return;

  selectSala.value = idDaSala;
  nomeLocal.textContent = idDaSala.toUpperCase();
  informacoesPainel.classList.remove('hidden');
  imagemSala.src = `./images/${idDaSala}.svg`;
  imagemSala.classList.remove('hidden');

  if (typeof exibirInformacoesDaSala === 'function') {
    exibirInformacoesDaSala(idDaSala);
  }

  scale = 1;
  applyZoom();
}

function applyZoom() {
  const planta = document.querySelector('.planta');
  const sala = document.querySelector('.sala');
  pinsContainer.style.transform = `scale(${scale})`;
  planta.style.transform = `translate(-50%, -50%) rotate(180deg) scale(${scale})`;

  if (!sala.classList.contains('hidden')) {
    sala.style.transform = `translate(-50%, -50%) rotate(90deg) scale(${scale})`;
  }
}

zoominBtn.addEventListener("click", () => {
  if (scale < maxScale) {
    scale = Math.min(scale + scaleStep, maxScale);
    applyZoom();
  }
});

zoomouBtn.addEventListener("click", () => {
  if (scale > minScale) {
    scale = Math.max(scale - scaleStep, minScale);
    applyZoom();
  }
});

wrapper.addEventListener("dblclick", () => {
  scale = 1;
  applyZoom();
});

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    map.requestFullscreen().then(() => scale = 1.2);
  } else {
    document.exitFullscreen().then(() => scale = 1);
  }
  applyZoom();
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    scale = 1;
    applyZoom();
  }
});

selectSala.addEventListener('change', () => {
  selecionarSala(selectSala.value);
});

diaDaSemanaSelect.addEventListener('change', () => {
  if (salaAtual) {
    exibirInformacoesDaSala(salaAtual);
  }
});

pinsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('map-pin')) {
    const idDaSala = event.target.dataset.sala;
    selecionarSala(idDaSala);
  }
});

document.addEventListener('DOMContentLoaded', inicializarDados);
