const Redis = require('ioredis');
const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');

const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.info('Redis connected!');
  if (config.isProd) logger.info('Redis connected!');
});

redis.on('error', (err) => {
  console.error(`Redis failed!: ${err.message}`);
  if (config.isProd) logger.error(`❌ redis connection failed: ${err.message}`);
});

module.exports = redis;
