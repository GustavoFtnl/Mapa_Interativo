const selectSala = document.getElementById('locationSelect');
const imagemSala = document.querySelector('.sala');
const informacoesPainel = document.getElementById('infoPanel');

selectSala.addEventListener('change', () => {
    const nomeSala = selectSala.value;
    console.log(nomeSala);

    if(imagemSala) {
        imagemSala.src = `./imagem/${nomeSala}.svg`
        imagemSala.classList.remove('hidden');
        informacoesPainel.classList.remove('hidden');
    } else {
        imagemSala.classList.add('hidden');
        informacoesPainel.classList.add('hidden');
    } 
})