const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/aulas', (req, res) => {
  const sql = `
    SELECT s.nome AS sala, d.nome AS disciplina, p.nome AS professor,
           h.hora_inicio, h.hora_fim, a.dia_semana
    FROM aulas a
    JOIN salas s ON a.id_sala = s.id
    JOIN disciplinas d ON a.id_disciplina = d.id
    JOIN professores p ON a.id_professor = p.id
    JOIN horarios h ON a.id_horario = h.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
