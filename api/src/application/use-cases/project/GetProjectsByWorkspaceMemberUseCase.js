const ProjectDto = require('../../dtos/project.dto');

class GetProjectsByWorkspaceMemberUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(workspaceId, workspaceMemberId) {
    const projects = await this.projectRepository.findAllByWorkspaceMember(
      workspaceId,
      workspaceMemberId,
    );
    return projects.map((project) => ProjectDto.withProjectMembers(project));
  }
}

module.exports = GetProjectsByWorkspaceMemberUseCase;
