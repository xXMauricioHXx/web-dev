const Produto = require('../models/ProdutoModel');

class ProdutoController {

  async list(req, res, next) {
    try {
      const produtos = await Produto.find();
      res.json(produtos);
      return next();
    } catch (err) {
      return next(err);
    }
  }

  async listById(req, res, next) {
    try {
      const { id } = req.params;
      const produto = await Produto.findById(id);

      if (!produto) {
        throw new Error('Product not found');
      }
      res.json(produto);
      return next();
    } catch (err) {
      return next(err);
    }
  }

}

module.exports = ProdutoController;