const diaDaSemanaSelect = document.getElementById('diasDaSemana');
const ulLista = document.getElementById('listaDeInformacoes');

let dadosSalas = {}; // Variável para guardar TODOS os dados do JSON
let salaAtual = '';  // Variável para saber qual sala está selecionada

/**
 * 1. Carrega os dados do arquivo JSON uma única vez.
 * Isso acontece assim que a página termina de carregar.
 */
async function inicializarDados() {
    try {
        const response = await fetch('./dados.json');
        if (!response.ok) {
            throw new Error('Erro de rede ao buscar o arquivo dados.json');
        }
        dadosSalas = await response.json();
        console.log("Dados carregados e prontos para uso!", dadosSalas);
    } catch (error) {
        console.error('Falha crítica ao carregar dados:', error);
        ulLista.innerHTML = '<li class="error-message">Não foi possível carregar as informações das salas.</li>';
    }
}

/**
 * 2. Função central para mostrar as informações na tela.
 * Ela será chamada pelo script.js sempre que uma sala for selecionada.
 */
function exibirInformacoesDaSala(idDaSala) {
    console.log("3. Função 'exibirInformacoesDaSala' recebeu o ID:", idDaSala); // LOG 3
    salaAtual = idDaSala; // Atualiza a sala que estamos vendo
    const diaDaSemana = diaDaSemanaSelect.value;
    console.log("4. Dia da semana atual:", diaDaSemana); // LOG 4

    ulLista.innerHTML = ''; // Limpa a lista anterior

    // Se não houver dados, sala ou dia válido, não faz nada
    if (!dadosSalas[salaAtual] || !diaDaSemana || diaDaSemana === 'Dia') {
        return;
    }

    const aulas = dadosSalas[salaAtual][diaDaSemana];

    // Verifica se existe o array de aulas e se ele não está vazio
    if (!aulas || aulas.length === 0) {
        ulLista.innerHTML = '<li>Nenhuma aula agendada para este dia.</li>';
        return;
    }

    // Cria os elementos da lista de forma mais eficiente
    const fragment = document.createDocumentFragment();
    aulas.forEach((aula) => {
        const li = document.createElement('li');

        // Usar innerHTML aqui é mais simples e seguro, pois os dados vêm do seu JSON
        li.innerHTML = `
            <h2>${aula.horario}</h2>
            <h3>${aula.disciplina}</h3>
            <p>Professor: ${aula.professor}</p>
        `;
        fragment.appendChild(li);
    });

    ulLista.appendChild(fragment);
}

/**
 * 3. O evento de mudança do dia da semana agora é muito mais simples.
 * Ele apenas chama a função para re-exibir os dados da sala atual.
 */
diaDaSemanaSelect.addEventListener('change', () => {
    // Se uma sala já estiver selecionada, apenas atualiza as informações
    if (salaAtual) {
        exibirInformacoesDaSala(salaAtual);
    }
});

// 4. Inicia o carregamento dos dados quando o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', inicializarDados);