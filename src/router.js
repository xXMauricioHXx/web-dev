const router = require('express').Router();
const ProdutoController = require('./controller/produto');
const UserController = require('./controller/user');

const produtoController = new ProdutoController();
const userController = new UserController();

router.get('/produtos', produtoController.list);
router.get('/produtos/:id', produtoController.listById);
//router.get('/favoritar/:id', userController.listFavorites);

module.exports = router;