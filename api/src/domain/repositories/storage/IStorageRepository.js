/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IStorageRepository {
  async upload() {
    throw boom.notImplemented('upload(file) Method not implemented');
  }

  async destroy() {
    throw boom.notImplemented('destroy(publicId) Method not implemented');
  }

  async get() {
    throw boom.notImplemented('get(publicId) Method not implemented');
  }
}

module.exports = IStorageRepository;
