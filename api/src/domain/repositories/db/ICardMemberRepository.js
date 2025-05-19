/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class ICardMemberRepository {
  async create() {
    throw boom.notImplemented(
      'the create(cardMemberEntity) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented('the delete(cardId) method is not implemented');
  }

  async findAll() {
    throw boom.notImplemented('the findAll(cardId) method is not implemented');
  }
}

module.exports = ICardMemberRepository;
