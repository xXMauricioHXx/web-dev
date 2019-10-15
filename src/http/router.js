const router = require('express').Router();
const ProdutoController = require('./controllers/produto');

const produtoController = new ProdutoController();

router.get('/produtos', produtoController.list);
router.get('/produtos/:id', produtoController.listById);

module.exports = router;
