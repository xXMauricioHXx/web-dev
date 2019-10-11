const ProdutoModel = require('../../models/produto');
const { ResourceNotFoundError } = require('../../errors');
const produtoModel = new ProdutoModel();

class ProdutoController {
  async find(req, res, next) {
    try {
      const produtos = await produtoModel.find();
      res.json(produtos);
      return next();
    } catch(err) {
      return next(err);
    }
  }

  async findById(req, res, next) {
    try {
      
      const id = req.params.id;
      const produto = await produtoModel.findById(id);
      
      if(!produto) {
        throw new ResourceNotFoundError();
      }
      
      res.send(produto);
      return next();
    }catch(err) {
      return next(err);
    }
  }
}

module.exports = ProdutoController;
