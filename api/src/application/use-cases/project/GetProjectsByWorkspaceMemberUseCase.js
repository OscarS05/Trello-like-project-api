const ProjectDto = require('../../dtos/project.dto');

class GetProjectsByWorkspaceMemberUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(workspaceId, workspaceMemberId) {
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }
    if (!workspaceMemberId) {
      throw new Error('Workspace Member ID is required');
    }

    const projects = await this.projectRepository.findAllByWorkspaceMember(
      workspaceId,
      workspaceMemberId,
    );

    return projects?.length > 0
      ? projects.map((project) => ProjectDto.withProjectMembers(project))
      : [];
  }
}

module.exports = GetProjectsByWorkspaceMemberUseCase;
