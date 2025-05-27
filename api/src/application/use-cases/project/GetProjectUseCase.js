const Boom = require('@hapi/boom');
const ProjectDto = require('../../dtos/project.dto');

class GetProjectUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId) {
    if (!projectId) {
      throw Boom.badRequest('Project ID was not provided');
    }

    const project = await this.projectRepository.findById(projectId);
    return project?.id ? new ProjectDto(project) : {};
  }
}

module.exports = GetProjectUseCase;
