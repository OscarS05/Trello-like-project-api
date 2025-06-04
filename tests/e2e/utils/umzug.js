const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../../../api/src/infrastructure/store/db/sequelize');
const {
  deleteUnverifiedUsersJob,
} = require('../../../api/utils/cron/verification.cron');
const redisClient = require('../../../api/src/infrastructure/store/cache/index');

const umzug = new Umzug({
  migrations: { glob: './api/src/infrastructure/store/db/seeders/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});

const upSeed = async () => {
  try {
    await sequelize.sync({ force: true });
    await umzug.up();
  } catch (error) {
    console.error(error);
  }
};

const downSeed = async () => {
  await redisClient.quit();
  deleteUnverifiedUsersJob.stop();
  await sequelize.drop();
};

module.exports = {
  upSeed,
  downSeed,
};
