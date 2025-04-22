const ProjectDto = require("../../dtos/project.dto");

class GetAllProjectInformationUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId) {
    const project = await this.projectRepository.getAllProjectInformation(projectId);
    return new ProjectDto(project);
  }
}

module.exports = GetAllProjectInformationUseCase;
