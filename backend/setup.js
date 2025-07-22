const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const dados = JSON.parse(fs.readFileSync('dados.json', 'utf-8'));

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  console.log('Conectado ao MySQL (sem banco).');

  await connection.query('CREATE DATABASE IF NOT EXISTS mapa_interativo_ufc');
  console.log('Banco de dados criado ou já existente.');

  await connection.end();

  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mapa_interativo_ufc'
  });
  console.log('Conectado ao banco mapa_interativo_ufc.');

  const tabelas = [
    `CREATE TABLE IF NOT EXISTS salas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) UNIQUE
    )`,

    `CREATE TABLE IF NOT EXISTS horarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hora_inicio VARCHAR(10),
      hora_fim VARCHAR(10),
      UNIQUE KEY (hora_inicio, hora_fim)
    )`,

    `CREATE TABLE IF NOT EXISTS professores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) UNIQUE
    )`,

    `CREATE TABLE IF NOT EXISTS disciplinas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) UNIQUE
    )`,

    `CREATE TABLE IF NOT EXISTS aulas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_sala INT,
      id_disciplina INT,
      id_professor INT,
      id_horario INT,
      dia_semana VARCHAR(20),
      FOREIGN KEY (id_sala) REFERENCES salas(id),
      FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id),
      FOREIGN KEY (id_professor) REFERENCES professores(id),
      FOREIGN KEY (id_horario) REFERENCES horarios(id)
    )`
  ];

  for (const sql of tabelas) {
    await db.query(sql);
  }
  console.log('Tabelas criadas ou já existentes.');

  async function getOrCreateId(table, nome) {
    const [rows] = await db.query(`SELECT id FROM ${table} WHERE nome = ?`, [nome]);
    if (rows.length > 0) return rows[0].id;
    const [result] = await db.query(`INSERT INTO ${table} (nome) VALUES (?)`, [nome]);
    return result.insertId;
  }

  async function getOrCreateHorario(hora_inicio, hora_fim) {
    const [rows] = await db.query(`SELECT id FROM horarios WHERE hora_inicio = ? AND hora_fim = ?`, [hora_inicio, hora_fim]);
    if (rows.length > 0) return rows[0].id;
    const [result] = await db.query(`INSERT INTO horarios (hora_inicio, hora_fim) VALUES (?, ?)`, [hora_inicio, hora_fim]);
    return result.insertId;
  }


  for (const salaNome in dados) {
    console.log(`Processando dados para: ${salaNome}`);

    const [salaExistente] = await db.query('SELECT id FROM salas WHERE nome = ?', [salaNome]);
    let id_sala;
    if (salaExistente.length > 0) {
      id_sala = salaExistente[0].id;
    } else {
      const [resultSala] = await db.query('INSERT INTO salas (nome) VALUES (?)', [salaNome]);
      id_sala = resultSala.insertId;
    }

    for (const [dia_semana, aulas] of Object.entries(dados[salaNome])) {
      for (const aula of aulas) {
        const [hora_inicio, hora_fim] = aula.horario.split('-');
        const id_horario = await getOrCreateHorario(hora_inicio, hora_fim);
        const id_disciplina = await getOrCreateId('disciplinas', aula.disciplina);
        const id_professor = await getOrCreateId('professores', aula.professor);

        await db.query(
          `INSERT INTO aulas (id_sala, id_disciplina, id_professor, id_horario, dia_semana)
           VALUES (?, ?, ?, ?, ?)`,
          [id_sala, id_disciplina, id_professor, id_horario, dia_semana]
        );
      }
    }
  }

  console.log('Dados importados com sucesso!');
  await db.end();
}

main().catch(err => {
  console.error('Erro:', err);
});