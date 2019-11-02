const { NotFoundError } = require("../errors");
const router = require("express").Router();
const ProdutoController = require("./controllers/produto");
const UsuarioController = require("./controllers/usuario");
const { verifyToken } = require("./middlewares/auth");

const produtoController = new ProdutoController();
const usuarioController = new UsuarioController();

router.get("/produtos", produtoController.list);
router.get("/produtos/:id", produtoController.listById);

router.post("/usuarios", usuarioController.createUser);
router.get("/usuarios/:id", verifyToken, usuarioController.findUserById);

router.get("/favoritos", usuarioController.listFavorites);

router.post("/login", usuarioController.auth);

module.exports = router;
