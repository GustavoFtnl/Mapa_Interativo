const selectSala = document.getElementById('locationSelect');
const imagemSala = document.querySelector('.sala');
const informacoesPainel = document.getElementById('infoPanel');
const map = document.querySelector('.map');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const wrapper = document.querySelector('.mock-map');
const zoominBtn = document.getElementById('zoominBtn');
const zoomouBtn = document.getElementById('zoomoutBtn');
const nomeLocal = document.getElementById('nomeLocal');

const minScale = 0.8; 
let scale = 1;
const scaleStep = 0.2;
const maxScale = 2.5;

window.globalSala = '';
selectSala.addEventListener('change', () => {
    const nomeSala = selectSala.value;
    window.globalSala = selectSala.value;
    nomeLocal.textContent = nomeSala.toUpperCase();
    console.log(nomeSala);

    if (imagemSala) {
        imagemSala.src = `./imagem/${nomeSala}.svg`
        imagemSala.classList.remove('hidden');
        informacoesPainel.classList.remove('hidden');

        scale = 1;
        applyZoom()

    } else {
        imagemSala.classList.add('hidden');
        informacoesPainel.classList.add('hidden');
    }
    
    const diaSelecionado = diaDaSemanaSelect.value;
    if (diaSelecionado && diaSelecionado !== 'Dia') {
      // Se já tem dia, carrega os dados de novo
      carregarDados().then((dados) => {
        if (dados[globalSala] && dados[globalSala][diaSelecionado]) {
          adicionarInformacaoDaSala(dados[globalSala], diaSelecionado);
        } else {
          ulLista.innerHTML = '<li>Nenhuma aula agendada</li>';
        }
      }).catch((err) => {
        console.error('Erro ao carregar dados:', err);
        ulLista.innerHTML = '<li>Erro ao carregar dados</li>';
      });
    }
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

