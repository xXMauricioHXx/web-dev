const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ResourceNotFoundError, UnauthorizedError } = require('../../errors');
const usuarioModel = require('../../models/usuario');

class UsuarioController {
  constructor() {
    this.config = {
      saltRounds: process.env.SALT_ROUNDS || 10,
      tokenHash: process.env.TOKEN_HASH || '',
      expiresIn: process.env.TOKEN_EXPIRES_IN || '',
    };
  }
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
      let user = req.body;
      user.password = await bcrypt.hash(user.password, this.config.saltRounds);

      user = await usuarioModel.create(user);
      res.json(user);
      return next();
    } catch (err) {
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

  async auth(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await usuarioModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedError();
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new UnauthorizedError();
      }

      const token = jwt.sign(
        { name: user.name, email, id: user._id },
        this.config.tokenHash,
        { expiresIn: this.config.expiresIn }
      );

      res.json({ token });
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = UsuarioController;
