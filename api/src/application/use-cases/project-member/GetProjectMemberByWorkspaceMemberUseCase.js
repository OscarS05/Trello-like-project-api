class GetProjectMemberByWorkspaceMemberUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(workspaceMemberId, projectId) {
    return this.projectMemberRepository.findByWorkspaceMember(
      workspaceMemberId,
      projectId,
    );
  }
}

module.exports = GetProjectMemberByWorkspaceMemberUseCase;
