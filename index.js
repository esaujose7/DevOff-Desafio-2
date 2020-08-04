const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
  res.json({msg: 'Dev Off challenge 2: https://github.com/devoffarg/DevOff-Desafio-2'});
})

const validateBody = (req, res, next) => {
  const { vueltas, mensaje } = req.body;
  if (!vueltas || !mensaje) {
    res.status(400).json({ msg: 'Bad request' });
    return;
  }
  next();
};

const produceMatrix = (text, rows, columns) => {
  const splittedMessage = text.split('');
  const matrix = Array(rows).fill(Array(columns).fill(''));
  let strCounter = 0; 
  return matrix.map(row => row.map(() => splittedMessage[strCounter++] || ' '));
};

const transposeMatrix = (matrix) => {
  const [rows, columns] = getMatrixSize(matrix);
  const transposedMatrix = Array(columns).fill(Array(rows).fill(''));
  return transposedMatrix.map((row, i) => row.map((s, j) => matrix[j][i]));
};

const getMatrixSize = matrix => [matrix.length, (matrix[0] || []).length];

const iterateMatrixToString = matrix => matrix.reduce((acc, v) => acc.concat(v.reduce((acc, v) => acc.concat(v), '')), '').trim();

app.post('/encrypt', validateBody, ({ body: { mensaje: text, vueltas: columns } }, res) => {
  res.status(200).json({ mensaje: iterateMatrixToString(transposeMatrix(produceMatrix(text, Math.ceil(text.length / columns), columns))) });
});

app.post('/decrypt', validateBody, ({ body: { mensaje: text, vueltas: rows } }, res) => {
  res.status(200).json({ mensaje: iterateMatrixToString(transposeMatrix(produceMatrix(text, rows, Math.ceil(text.length / rows)))) });
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
