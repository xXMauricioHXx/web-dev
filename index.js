const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
const router = require('./src/router');

mongoose.connect('mongodb+srv://Murillors:devweb@cluster0-cgykh.mongodb.net/produto?retryWrites=true&w=majority', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
  app.use(router);
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
})
db.on('error', (err) => {
  console.log(err);
})




