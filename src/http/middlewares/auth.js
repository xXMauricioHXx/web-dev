const jwt = require('jsonwebtoken');
const usuarioModel = require('../../models/usuario');
const { UnauthorizedError } = require('../../errors');

require('dotenv').config();

const verifyToken = async (res, req, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      throw new UnauthorizedError();
    }
    const secret = process.env.TOKEN_SECRET;
    const decoded = await jwt.verify(token, secret);
    const user = await usuarioModel.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError();
    }
    req.userId = user.id;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { verifyToken: verifyToken };
