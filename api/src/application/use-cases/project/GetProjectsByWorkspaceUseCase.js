const ProjectDto = require('../../dtos/project.dto');

class GetProjectsByWorkspaceUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(workspaceId) {
    if (!workspaceId) {
      throw new Error('Workspace ID was not provided or is required');
    }

    const projects =
      await this.projectRepository.findAllByWorkspace(workspaceId);
    return projects?.length
      ? projects.map((project) => new ProjectDto(project))
      : [];
  }
}

module.exports = GetProjectsByWorkspaceUseCase;
