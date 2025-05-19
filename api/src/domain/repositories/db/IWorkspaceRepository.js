/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IWorkspaceRepository {
  async create() {
    throw boom.notImplemented('the create() method is not implemented');
  }

  async update() {
    throw boom.notImplemented('the update() method is not implemented');
  }

  async delete() {
    throw boom.notImplemented('the delete() method is not implemented');
  }

  async findById() {
    throw boom.notImplemented('the findById() method is not implemented');
  }

  async findAll() {
    throw boom.notImplemented('the findAll() method is not implemented');
  }
}

module.exports = IWorkspaceRepository;
