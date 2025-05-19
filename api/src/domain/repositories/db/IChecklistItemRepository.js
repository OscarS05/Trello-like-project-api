/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IChecklistItemRepository {
  async create() {
    throw boom.notImplemented(
      'the create(checklistItemEntity) method is not implemented',
    );
  }

  async bulkCreate() {
    throw boom.notImplemented(
      'the bulkCreate(checklistItemEntities) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(checklistItemUpdateEntity) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented(
      'the delete(checklistItemId) method is not implemented',
    );
  }

  async findOneByIdAndProject() {
    throw boom.notImplemented(
      'the findOneByIdAndProject(checklistItemId, projectId) method is not implemented',
    );
  }

  async findOne() {
    throw boom.notImplemented(
      'the findOneByIdAndProject(checklistItemId, projectId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(projectId) method is not implemented',
    );
  }
}

module.exports = IChecklistItemRepository;
