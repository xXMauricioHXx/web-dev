const router = require('express').Router();
const ProdutoController = require('./controllers/produto');
const UsuarioController = require('./controllers/usuario');

const produtoController = new ProdutoController();
const usuarioController = new UsuarioController();

router.get('/produtos', produtoController.list);
router.get('/produtos/:id', produtoController.listById);

router.post('/usuarios', usuarioController.createUser);
router.get('/usuarios/:id', usuarioController.findUserById);

module.exports = router;
