/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IChecklistRepository {
  async create() {
    throw boom.notImplemented(
      'the create(checklistEntity) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(checklistUpdateEntity) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented(
      'the delete(checklistId) method is not implemented',
    );
  }

  async findChecklistsByProject() {
    throw boom.notImplemented(
      'the create(projectId) method is not implemented',
    );
  }

  async findChecklistsByCard() {
    throw boom.notImplemented(
      'the findChecklistsByCard(cardId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(projectId) method is not implemented',
    );
  }

  async findOneByIdWithData() {
    throw boom.notImplemented(
      'the findOneByIdWithData(checklistId) method is not implemented',
    );
  }
}

module.exports = IChecklistRepository;
