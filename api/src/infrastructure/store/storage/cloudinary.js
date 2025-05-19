const { v2: cloudinary } = require('cloudinary');
const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

cloudinary.api.ping((error, result) => {
  if (error) {
    if (config.isProd) {
      logger.error('❌ Error connecting to Cloudinary:', error);
    } else {
      console.error('Connection to Cloudinary failed:', error);
    }
  } else if (config.isProd) {
    logger.info('Cloudinary successfully connected');
  } else {
    console.info(
      'Connection to Cloudinary established: status:',
      result.status,
    );
  }
});

module.exports = cloudinary;
