const ProjectDto = require('../../dtos/project.dto');

class GetAllProjectInformationUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId) {
    if (!projectId) {
      throw new Error('Project ID was not provided or is required');
    }

    const project =
      await this.projectRepository.getAllProjectInformation(projectId);
    return project?.id ? new ProjectDto(project) : {};
  }
}

module.exports = GetAllProjectInformationUseCase;
