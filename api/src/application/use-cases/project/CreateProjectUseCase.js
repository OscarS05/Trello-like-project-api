const Boom = require('@hapi/boom');
const ProjectEntity = require('../../../domain/entities/ProjectEntity');
const ProjectMemberEntity = require('../../../domain/entities/projectMemberEntity');
const ProjectDto = require('../../dtos/project.dto');

class CreateProjectUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectData) {
    if (!projectData.workspaceId) {
      throw Boom.badData('workspaceId was not provided');
    }
    if (!projectData.workspaceMemberId) {
      throw Boom.badData('workspaceMemberId was not provided');
    }

    const projectEntity = new ProjectEntity(projectData);

    const projectMemberEntity = new ProjectMemberEntity({
      workspaceMemberId: projectEntity.workspaceMemberId,
      projectId: projectEntity.id,
      role: 'owner',
    });

    const projectCreated = await this.projectRepository.create(
      projectEntity,
      projectMemberEntity,
    );

    if (!projectCreated?.id) {
      throw Boom.internal('Something went wrong while creating the project');
    }

    return new ProjectDto(projectCreated);
  }
}

module.exports = CreateProjectUseCase;
