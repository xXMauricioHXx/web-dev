const express = require('express');
const app = express();
const port = 3000;
const router = require('./src/router');

app.use(router);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});