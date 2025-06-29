const selectSala = document.getElementById('locationSelect');
const imagemSala = document.querySelector('.sala');
const informacoesPainel = document.getElementById('infoPanel');
const map = document.querySelector('.map');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const wrapper = document.querySelector('.mock-map');
const zoominBtn = document.getElementById('zoominBtn');
const zoomouBtn = document.getElementById('zoomoutBtn');
let scale = 1;
const maxScale = 1.2;


selectSala.addEventListener('change', () => {
    const nomeSala = selectSala.value;
    console.log(nomeSala);

    if (imagemSala) {
        imagemSala.src = `./imagem/${nomeSala}.svg`
        imagemSala.classList.remove('hidden');
        informacoesPainel.classList.remove('hidden');
    } else {
        imagemSala.classList.add('hidden');
        informacoesPainel.classList.add('hidden');
    }
})

fullscreenBtn.addEventListener('click', () => { // evento tela cheia( mantém os botões de zoom)
    map.requestFullscreen()
});

function applyZoom() {
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = "center center";
}

// Botão de zoom in (aumenta até o máximo)
zoominBtn.addEventListener("click", () => {
    if (scale < maxScale) {
        scale += 0.2;
        applyZoom();
    }
});

zoomoutBtn.addEventListener("click", () => {
    scale = 1;
    applyZoom();
});