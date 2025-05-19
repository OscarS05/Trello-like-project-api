/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IListRepository {
  async create() {
    throw boom.notImplemented(
      'the create(listEntity) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(listUpdateEntity) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented('the delete(listId) method is not implemented');
  }

  async findOneById() {
    throw boom.notImplemented('the findById(listId) method is not implemented');
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(projectId) method is not implemented',
    );
  }
}

module.exports = IListRepository;
