const { ResourceNotFoundError } = require('../../errors');
const produtoModel = require('../../models/produto');

class ProdutoController {
  async list(req, res, next) {
    try {
      //Alteração
      const produtos = await produtoModel.find();
      res.json(produtos);
      return next();
    } catch (err) {
      return next(err);
    }
  }

  async listById(req, res, next) {
    try {
      const { id } = req.params;
      const produto = await produtoModel.findById(id);

      if (!produto) {
        throw new ResourceNotFoundError();
      }

      res.json(produto);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = ProdutoController;
