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

const minScale = 0.8;
let scale = 1;
const scaleStep = 0.2;
const maxScale = 2.5;

window.globalSala = '';
selectSala.addEventListener('change', () => {
  selecionarSala(selectSala.value);
})

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    map.requestFullscreen().then(() => {
      adjustFullscreenZoom();
    });
  } else {
    document.exitFullscreen().then(() => {
      adjustNormalZoom();
    });
  }
});

function adjustFullscreenZoom() {
  scale = 1.2;
  applyZoom();
}

function adjustNormalZoom() {
  // Volta ao zoom normal ao sair da tela cheia
  scale = 1;
  applyZoom();
}

// Ouvinte para detectar mudanças no modo tela cheia
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    adjustNormalZoom();
  }
});

function applyZoom() {
  const planta = document.querySelector('.planta');
  const sala = document.querySelector('.sala');
  pinsContainer.style.transform = `scale(${scale})`;
  planta.style.transform = `translate(-50%, -50%) rotate(180deg) scale(${scale})`;

  if (!sala.classList.contains('hidden')) {
    // Pega o ID da sala que está selecionada no momento
    const idDaSala = selectSala.value;

    // Extrai o número do ID da sala (ex: "sala5" -> 5)
    const numeroDaSala = parseInt(idDaSala.replace('sala', ''));

    let rotacao = 90; // Rotação padrão para as salas

    // Aplica a rotação que foi decidida pela lógica acima
    sala.style.transform = `translate(-50%, -50%) rotate(${rotacao}deg) scale(${scale})`;
  }
}

zoominBtn.addEventListener("click", () => {
  if (scale < maxScale) {
    scale = Math.min(scale + scaleStep, maxScale);
    applyZoom();
  }
});

zoomoutBtn.addEventListener("click", () => {
  if (scale > minScale) {
    scale = Math.max(scale - scaleStep, minScale);
    applyZoom();
  }
});

wrapper.addEventListener("dblclick", () => {
  scale = 1;
  applyZoom();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let termo = searchInput.value.trim().toLowerCase();

    // Normaliza entrada: transforma "sala 1" em "sala1"
    termo = termo.replace(/\s+/g, '');
    // Procura se o valor digitado existe entre as opções do select
    let encontrou = false;
    for (let option of selectSala.options) {
      if (option.value.toLowerCase() === termo) {
        selectSala.value = option.value;
        selectSala.dispatchEvent(new Event("change")); // Dispara evento para carregar a imagem
        encontrou = true;
        break;
      }
    }
    if (encontrou) {
      selecionarSala(option.value);
    } else {
      imagemSala.classList.add("hidden");
      informacoesPainel.classList.add("hidden");
      nomeLocal.textContent = "";
      alert("Local não encontrado");
    }

  }
});

function selecionarSala(idDaSala) {
  console.log("1. Sala selecionada:", idDaSala); // LOG 1
  if (!idDaSala) return;

  // 1. Atualiza o valor do select (para manter a consistência)
  selectSala.value = idDaSala;

  // 2. Atualiza o painel de informações
  nomeLocal.textContent = idDaSala.toUpperCase();
  informacoesPainel.classList.remove('hidden');

  // 3. Mostra a imagem da sala
  imagemSala.src = `./imagem/${idDaSala}.svg`;
  imagemSala.classList.remove('hidden');

  selectSala.value = idDaSala;
  nomeLocal.textContent = idDaSala.toUpperCase();
  informacoesPainel.classList.remove('hidden');
  imagemSala.src = `./imagem/${idDaSala}.svg`;
  imagemSala.classList.remove('hidden');

  // 4. Dispara a lógica de carregamento de horários do scriptSala.js
  // (Esta é a forma correta de comunicar entre os scripts)
  if (typeof exibirInformacoes === 'function') {
    const diaSelecionado = diaDaSemanaSelect.value;
    exibirInformacoes(idDaSala, diaSelecionado);
  } else {
    // Se a função não existir, podemos forçar o evento de change do select de dia
    diaDaSemanaSelect.dispatchEvent(new Event("change"));
  }
  // Ela vai "conversar" com o scriptSala.js e pedir para ele mostrar as infos.
  if (typeof exibirInformacoesDaSala === 'function') {
    console.log("2. Função 'exibirInformacoesDaSala' encontrada. Chamando..."); // LOG 2
    exibirInformacoesDaSala(idDaSala);
  }
  else {
    // Este erro aparecerá se a ordem dos scripts estiver errada!
    console.error("ERRO CRÍTICO: A função 'exibirInformacoesDaSala' do scriptSala.js não foi encontrada!");
  }
  // 5. Reseta o zoom
  scale = 1;
  applyZoom();
}


pinsContainer.addEventListener('click', (event) => {
  // Verifica se o que foi clicado foi um pino
  if (event.target.classList.contains('map-pin')) {
    const idDaSala = event.target.dataset.sala;
    selecionarSala(idDaSala);
  }
});