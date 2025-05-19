const boom = require('@hapi/boom');
const UpdateWorkspaceEntity = require('../../../domain/entities/UpdateWorkspaceEntity');
const WorkspaceDto = require('../../dtos/workspace.dto');

class UpdateWorkspaceUseCase {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(workspaceId, workspaceData) {
    const updateWorkspaceEntity = new UpdateWorkspaceEntity(
      workspaceData,
    ).toPlainObject();

    const [updatedRows, [updatedWorkspace]] =
      await this.workspaceRepository.update(workspaceId, updateWorkspaceEntity);
    if (updatedRows === 0) throw boom.notFound('Workspace not found');

    return new WorkspaceDto(updatedWorkspace);
  }
}

module.exports = UpdateWorkspaceUseCase;
