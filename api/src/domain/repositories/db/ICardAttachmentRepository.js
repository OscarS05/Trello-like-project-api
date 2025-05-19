/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class ICardAttachmentRepository {
  async create() {
    throw boom.notImplemented(
      'the create(cardAttachmentEntity) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(entityUpdateCardAttachment) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented(
      'the delete(cardAttachmentId) method is not implemented',
    );
  }

  async findOne() {
    throw boom.notImplemented(
      'the findOne(cardId, cardAttachmentId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented('the findAll(cardId) method is not implemented');
  }
}

module.exports = ICardAttachmentRepository;
