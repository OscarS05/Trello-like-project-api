/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class ILabelRepository {
  async create() {
    throw boom.notImplemented(
      'the create(labelEntity) method is not implemented',
    );
  }

  async createVisibilityOfLabel() {
    throw boom.notImplemented(
      'the createVisibilityOfLabel(cardId, labelId method is not implemented',
    );
  }

  async updateVisibility() {
    throw boom.notImplemented(
      'the updateVisibility(ids, updateVisibilityLabelEntity) method is not implemented',
    );
  }

  async findLabelsByCard() {
    throw boom.notImplemented(
      'the findLabelsByCard(cardId) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(labelUpdateEntity) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented('the delete(labelId) method is not implemented');
  }

  async findOneById() {
    throw boom.notImplemented(
      'the findById(labelId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(projectId) method is not implemented',
    );
  }
}

module.exports = ILabelRepository;
