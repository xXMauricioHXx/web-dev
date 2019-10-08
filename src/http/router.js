const router = require('express').Router();
const ProdutoController = require('./controllers/produto');

const produtoController = new ProdutoController();

router.get('/produtos', produtoController.find);
router.get('/produtos/:id', produtoController.findById);

module.exports = router;