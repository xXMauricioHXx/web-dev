const router = require('express').Router();
const ProdutoController = require('./controller/produto');

const produtoController = new ProdutoController();

router.get('/produtos', produtoController.list);

module.exports = router;