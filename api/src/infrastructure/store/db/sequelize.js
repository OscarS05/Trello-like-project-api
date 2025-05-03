const { Sequelize } = require('sequelize');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');
const setupModels = require('../db/models');

const options = {
  dialect: 'postgres',
  logging: config.isProd ? (msg) => logger.info(msg) : console.log,
}

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

const sequelize = new Sequelize(config.dbUrl, options);

(async () => {
  try {
    await sequelize.authenticate();
    if (config.isProd) logger.info('Database connected!');
    console.info('Database connected!');
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    console.log(`❌ Database connection failed: ${error.message}`)
    process.exit(1);
  }
})();


setupModels(sequelize);

module.exports = sequelize;
