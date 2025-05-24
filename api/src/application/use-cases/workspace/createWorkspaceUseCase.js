const Boom = require('@hapi/boom');
const WorkspaceEntity = require('../../../domain/entities/WorkspaceEntity');
const WorkspaceDto = require('../../dtos/workspace.dto');

class CreateWorkspaceUseCase {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(workspaceData) {
    if (!workspaceData?.userId) {
      throw Boom.badData('UserId was not provided');
    }

    const workspaceEntity = new WorkspaceEntity(workspaceData);

    const { workspace } =
      await this.workspaceRepository.create(workspaceEntity);

    return new WorkspaceDto(workspace);
  }
}

module.exports = CreateWorkspaceUseCase;
