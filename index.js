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

const produceMatrix = (mensaje, vueltas) => {
  const splittedMessage = mensaje.split('');
  const matrix = Array(Math.ceil(mensaje.length / vueltas)).fill(Array(vueltas).fill(''));
  let strCounter = 0; 
  return matrix.map(row => row.map(() => splittedMessage[strCounter++] || ' '));
};

const transposeMatrix = (matrix) => {
  const [rows, columns] = getMatrixSize(matrix);
  const transposedMatrix = Array(columns).fill(Array(rows).fill(''));
  return transposedMatrix.map((row, i) => row.map((s, j) => matrix[j][i]));
};

const getMatrixSize = matrix => [matrix.length, (matrix[0] || []).length];

const iterateToString = matrix => matrix.reduce((acc, v) => acc.concat(v.reduce((acc, v) => acc.concat(v), '')), '').trim();

app.post('/encrypt', validateBody, (req, res) => {
  res.status(200).json({ mensaje: iterateToString(transposeMatrix(produceMatrix(req.body.mensaje, req.body.vueltas))) });
});

app.post('/decrypt', validateBody, (req, res) => {
  res.status(200).json({ mensaje: iterateToString(transposeMatrix(produceMatrix(req.body.mensaje, req.body.vueltas))) })
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
