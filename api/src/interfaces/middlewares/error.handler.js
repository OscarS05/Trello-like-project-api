const { ValidationError } = require('sequelize');
const { MulterError } = require('multer');

const logger = require('../../../utils/logger/logger');
const { config } = require('../../../config/config');

function logErrors(err, req, res, next) {
  next(err);
}

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  }
  next(err);
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

function multerErrorHandler(err, req, res, next) {
  if (err instanceof MulterError) {
    res.status(400).json({
      statusCode: 400,
      message: err.message,
    });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  const isProd = config.isProd;
  if (isProd) {
    logger.warn('error 500:', err);
  } else {
    console.log('err:', err);
  }
  res.status(500).json({
    message: err,
    stack: err.message,
  });
}
module.exports = {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
  multerErrorHandler,
};
