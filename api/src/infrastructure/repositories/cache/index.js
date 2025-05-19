const redisClient = require('../../store/cache/index');

const AuthRedisRepository = require('./auth.redisRepository');

const config = {
  redisClient,
};

const AuthRedis = new AuthRedisRepository(config.redisClient);

module.exports = {
  AuthRedis,
};
