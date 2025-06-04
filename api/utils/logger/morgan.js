const morgan = require('morgan');
const logger = require('./logger');
const { config } = require('../../config/config');

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return (
      `[${tokens.date(req, res)}] ${tokens.method(req, res)} ${tokens.url(req, res)} ` +
      `${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`
    );
  },
  {
    stream: {
      write: (message) =>
        config.isProd
          ? logger.info(message.trim())
          : console.info(message.trim()),
    },
  },
);

module.exports = morganMiddleware;
