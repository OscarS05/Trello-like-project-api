const ProjectDto = require('../../dtos/project.dto');

class GetProjectsByWorkspaceUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(workspaceId) {
    const projects =
      await this.projectRepository.findAllByWorkspace(workspaceId);
    return projects.map((project) => new ProjectDto(project));
  }
}

module.exports = GetProjectsByWorkspaceUseCase;
