const Cloudinary = require('../../store/storage/cloudinary');

const CloudinaryStorageRepository = require('./CloudinaryStorageRepository');

const cloudinaryStorageRepository = new CloudinaryStorageRepository(Cloudinary);

module.exports = {
  cloudinaryStorageRepository,
};
