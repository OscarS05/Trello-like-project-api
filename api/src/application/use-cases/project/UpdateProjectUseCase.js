const boom = require('@hapi/boom');
const ProjectUpdateEntity = require('../../../domain/entities/ProjectUpdateEntity');
const ProjectDto = require('../../dtos/project.dto');

class UpdateProjectUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId, projectData) {
    if (!projectId) throw boom.badRequest('ProjectId was not provided');

    const projectUpdateEntity = new ProjectUpdateEntity(projectData);

    const [updatedRows, [updatedProject]] = await this.projectRepository.update(
      projectId,
      projectUpdateEntity,
    );
    if (updatedRows === 0)
      throw boom.notFound(
        'Something went wrong, project not found or no changes made',
      );

    return new ProjectDto(updatedProject);
  }
}

module.exports = UpdateProjectUseCase;
