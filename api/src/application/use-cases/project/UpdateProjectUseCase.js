const boom = require('@hapi/boom');
const ProjectUpdateEntity = require('../../../domain/entities/ProjectUpdateEntity');
const ProjectDto = require('../../dtos/project.dto');

class UpdateProjectUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId, projectData) {
    const projectUpdateEntity = new ProjectUpdateEntity(projectData);

    const [updatedRows, [updatedProject]] = await this.projectRepository.update(
      projectId,
      projectUpdateEntity,
    );
    if (!updatedProject) throw boom.notFound('Failed to update project');
    if (updatedRows === 0) throw boom.notFound('Project not found');

    return new ProjectDto(updatedProject);
  }
}

module.exports = UpdateProjectUseCase;
