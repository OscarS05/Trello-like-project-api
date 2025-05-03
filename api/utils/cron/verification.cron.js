const cron = require('node-cron');
const logger = require('../logger/logger');
const { config } = require('../../config/config');
const { userService } = require('../../src/application/services/index');

const isProd = config.isProd;

function isVerificationExpired(createdAt, expirationTime){
  const expirationDate = new Date(createdAt).getTime() + expirationTime;
  return Date.now() > expirationDate;
};

const deleteUnverifiedUsersJob = cron.schedule('0 0 * * *', async () => {
  try {
    const users = await userService.getUsers({ isVerified: false });

    let deletedUsersCount = 0;

    for(const user of users){
      if(isVerificationExpired(user.createdAt, 7 * 24 * 60 * 60 * 1000)) {
        await userService.deleteAccount(user.id);
        deletedUsersCount++;
      }
    }

    const message =
      deletedUsersCount > 0
        ? `${deletedUsersCount} unverified accounts removed.`
        : `No unverified accounts found for removal.`;

    if(isProd) logger.info(message);
    console.log(message)
  } catch (error) {
    const messageError = `Error in cron job ${error.message}`;
    if(isProd) logger.error(messageError);
    if(!isProd) console.error(error)
  }
});

deleteUnverifiedUsersJob.start();

module.exports = { deleteUnverifiedUsersJob }
