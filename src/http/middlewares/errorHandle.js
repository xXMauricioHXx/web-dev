const logger = require('../../logger');
const { ResourceNotFoundError } = require('../../errors');

module.exports = (err, req, res, next) => {
  logger.error('Handling http error', {
    error: {
      message: err.message,
      code: err.code,
    },
    method: req.method,
    path: req.path,
  });

  if (err instanceof ResourceNotFoundError) {
    res.status(404).send(err);
    return next();
  }

  res.status(500).send({
    code: 'UNEXPECTED_ERROR',
    message: 'Internal server failure',
  });

  return next();
};
