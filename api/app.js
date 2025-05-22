/* eslint-disable global-require */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');

const routerApi = require('./src/interfaces/routes');
const specs = require('./utils/docs/swagger');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
  multerErrorHandler,
} = require('./src/interfaces/middlewares/error.handler');

const morganMiddleware = require('./utils/logger/morgan');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  require('./utils/auth');
  require('./utils/cron/verification.cron');

  app.use(morganMiddleware);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
  routerApi(app);

  app.use(logErrors);
  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(multerErrorHandler);
  app.use(errorHandler);

  app.use((err, req, res, next) => {
    if (err instanceof Error && err.message === 'Not authorized by CORS') {
      return res.status(403).json({ message: 'Domain not allowed by CORS' });
    }
    return next(err);
  });

  return app;
};

module.exports = createApp;
