const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMembersOfWorkspaceMemberUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(workspaceMemberId) {
    if (!workspaceMemberId) {
      throw new Error('workspaceMemberId was not provided');
    }

    const projectMembers =
      await this.projectMemberRepository.findAll(workspaceMemberId);

    return projectMembers?.length > 0
      ? projectMembers.map((projectMember) =>
          ProjectMemberDto.withProject(projectMember),
        )
      : [];
  }
}

module.exports = GetProjectMembersOfWorkspaceMemberUseCase;
