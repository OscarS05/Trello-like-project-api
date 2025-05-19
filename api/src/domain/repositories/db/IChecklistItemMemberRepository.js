/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IChecklistItemMemberRepository {
  async create() {
    throw boom.notImplemented(
      'the create(checklistItemMemberEntity) method is not implemented',
    );
  }

  async bulkCreate() {
    throw boom.notImplemented(
      'the create(checklistItemMembersEntities) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented(
      'the delete(checklistItemMemberId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(checklistItemId) method is not implemented',
    );
  }

  async findAllByProjectMemberId() {
    throw boom.notImplemented(
      'the findAll(checklistItemId) method is not implemented',
    );
  }
}

module.exports = IChecklistItemMemberRepository;
