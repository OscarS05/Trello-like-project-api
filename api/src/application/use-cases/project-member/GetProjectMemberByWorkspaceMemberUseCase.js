class GetProjectMemberByWorkspaceMemberUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(workspaceMemberId, projectId) {
    if (!workspaceMemberId) {
      throw new Error('workspaceMemberId was not provided');
    }
    if (!projectId) {
      throw new Error('projectId was not provided');
    }
    const projectMember =
      await this.projectMemberRepository.findByWorkspaceMember(
        workspaceMemberId,
        projectId,
      );

    return projectMember?.id ? projectMember : {};
  }
}

module.exports = GetProjectMemberByWorkspaceMemberUseCase;
