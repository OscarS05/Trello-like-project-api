const morgan = require('morgan');
const logger = require('./logger');

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return (
      `[${tokens.date(req, res)}] ${tokens.method(req, res)} ${tokens.url(req, res)} ` +
      `${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`
    );
  },
  { stream: { write: (message) => logger.info(message.trim()) } },
);

module.exports = morganMiddleware;
