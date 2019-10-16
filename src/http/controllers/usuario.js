const { ResourceNotFoundError } = require('../../errors');
const usuarioModel = require('../../models/usuario');

class UsuarioController {
  async listFavorites(req, res, next) {
    const { user_id } = req.headers;

    const favorites = await usuarioModel.favorites;

    if (!favorites) {
      return res.status(404).json({ error: 'Favorite product not found' });
      //throw new Error('Product not found');
    }

    return res.json(favorites);
  }

  async createUser(req, res, next) {
    try {
      const user = await usuarioModel.create(req.body);
      res.json(user);
      return next();
    } catch (erre) {
      return next(err);
    }
  }

  async findUserById(req, res, next) {
    try {
      const id = req.params.id;

      const user = await usuarioModel.findOne({ id });

      if (!user) {
        throw new ResourceNotFoundError();
      }

      res.json(user);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = UsuarioController;
