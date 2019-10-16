const logger = require('../../logger');
const { ResourceNotFoundError, NotFoundError } = require('../../errors');

module.exports = (err, req, res, next) => {
  console.log(err);
  logger.error('Handling http error', {
    error: {
      message: err.message,
      code: err.code,
    },
    method: req.method,
    path: req.path,
  });

  if (err instanceof ResourceNotFoundError || err instanceof NotFoundError) {
    res.status(404).send(err);
    return next();
  }

  res.status(500).send({
    code: 'UNEXPECTED_ERROR',
    message: 'Internal server failure',
  });

  return next();
};
