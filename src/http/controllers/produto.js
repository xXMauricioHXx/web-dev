const { ResourceNotFoundError } = require("../../errors");
const produtoModel = require("../../models/produto");

class ProdutoController {
  async list(req, res, next) {
    try {
      const produtos = await produtoModel.find();
      res.json(produtos);
      return next();
    } catch (err) {
      return next(err);
    }
  }

  async listByNameOrCategory(req, res, next) {
    try {
      const nameOrCategory = req.query.q;

      const products = await produtoModel.find({
        $or: [
          { name: { $regex: nameOrCategory, $options: "i" } },
          { category: { $regex: nameOrCategory, $options: "i" } }
        ]
      });
      res.json(products);
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
