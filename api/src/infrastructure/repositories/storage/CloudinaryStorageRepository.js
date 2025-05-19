const { Readable } = require('stream');
const IStorageRepository = require('../../../domain/repositories/storage/IStorageRepository');

class CloudinaryStorageRepository extends IStorageRepository {
  constructor(cloudinary) {
    super();
    this.cloudinary = cloudinary;
  }

  async upload(file, folder) {
    return this.cloudinary.uploader.upload(file.path, {
      folder,
      use_filename: true,
      unique_filename: true,
    });
  }

  async uploadStream({ buffer, folder }) {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }

  async destroy(publicId) {
    return this.cloudinary.uploader.destroy(publicId);
  }

  async getMetadata(publicId, folder) {
    const fullId = folder ? `${folder}/${publicId}` : publicId;
    return this.cloudinary.api.resource(fullId, {
      resource_type: 'auto',
    });
  }

  async getUrl(publicId, folder) {
    const fullId = folder ? `${folder}/${publicId}` : publicId;
    return this.cloudinary.url(fullId, {
      secure: true,
      resource_type: 'auto',
    });
  }
}

module.exports = CloudinaryStorageRepository;
