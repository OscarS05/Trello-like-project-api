/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class ICardRepository {
  async create() {
    throw boom.notImplemented(
      'the create(cardEntity) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(cardUpdateEntity) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented('the delete(cardId) method is not implemented');
  }

  async findOneById() {
    throw boom.notImplemented('the findById(cardId) method is not implemented');
  }

  async findAll() {
    throw boom.notImplemented('the findAll(listId) method is not implemented');
  }
}

module.exports = ICardRepository;
