const diaDaSemanaSelect = document.getElementById('diasDaSemana');
const ulLista = document.getElementById('listaDeInformacoes');

let dados = []
diaDaSemanaSelect.addEventListener('change', async () => {

    try {
        dados = await carregarDados(); // Aguarda a resolução da Promise
        const diaDaSemana = diaDaSemanaSelect.value;

        // Verifica se existem aulas para esse dia
        if (dados[globalSala] && dados[globalSala][diaDaSemana]) {
            console.log(dados[globalSala][diaDaSemana]); // Agora mostra os dados corretamente
            adicionarInformacaoDaSala(dados[globalSala], diaDaSemana);
        } else {
            console.log("Nenhuma aula para este dia");
            ulLista.innerHTML = '<li>Nenhuma aula agendada</li>';
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
})

async function carregarDados() {
    try {
        const response = await fetch('./dados.json');
        if (!response.ok) {
            throw new Error('Erro ao buscar o arquivo')
        }
        const json = await response.json()
        return json
    } catch (error) {
        console.error('Erro ao carregar o arquivo:', error);
        return null;
    }
}

function adicionarInformacaoDaSala(sala, diaDaSemana) {
    ulLista.innerHTML = '';

    const aulas = sala[diaDaSemana];

    if (!sala.length == null || sala.length === 0) {
        ulLista.innerHTML = '<li>Nenhuma aula agendada</li>';
        return;
    }

    if (!aulas || aulas.length === 0) {
        ulLista.innerHTML = '<li>Nenhuma aula agendada</li>';
        return;
    }

    aulas.forEach((aula) => {
        const li = document.createElement('li');

        const horario = document.createElement('h2');
        horario.textContent = aula.horario;

        const materia = document.createElement('h3');
        materia.textContent = aula.disciplina;

        const professor = document.createElement('p');
        professor.textContent = `Professor: ${aula.professor}`;

        li.appendChild(horario);
        li.appendChild(materia);
        li.appendChild(professor);

        ulLista.appendChild(li);
    });
}
